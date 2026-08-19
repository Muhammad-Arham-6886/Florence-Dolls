import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  initCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartItems,
  syncLocalCartToWp,
  applyCoupon as wpApplyCoupon,
  removeCoupon as wpRemoveCoupon,
  normalizeCartItems,
} from '../lib/woo';

const CartContext = createContext(null);

const CART_KEY = 'fd_cart';
const WISH_KEY = 'fd_wishlist';
const USER_KEY = 'fd_user';
const USERS_KEY = 'fd_users';

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load(CART_KEY) || []);
  const [wishlist, setWishlist] = useState(() => load(WISH_KEY) || []);
  const [user, setUser] = useState(() => load(USER_KEY) || null);
  const [toast, setToast] = useState(null);
  const [toastTimer, setToastTimer] = useState(null);
  const [wpActive, setWpActive] = useState(false);
  const wpTokenRef = useRef(null);
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => save(WISH_KEY, wishlist), [wishlist]);
  useEffect(() => save(USER_KEY, user), [user]);

  // Connect to the live WooCommerce cart once on load. The cart display keeps
  // working from localStorage whenever the Store API is unreachable. If the
  // WordPress session cart is empty but the local basket has items (expired
  // session, failed sync), push the local basket back into WordPress so the
  // shop basket and checkout always agree.
  useEffect(() => {
    let cancelled = false;
    initCart()
      .then(({ cart: wpCart, token }) => {
        if (cancelled) return;
        wpTokenRef.current = token;
        setWpActive(true);
        if (wpCart.items.length > 0) {
          setCart(wpCart.items);
        } else if (cartRef.current.length > 0) {
          syncLocalCartToWp(cartRef.current, token)
            .then(({ cart: synced }) => {
              if (!cancelled) adoptWpCart(synced.items);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (!cancelled) setWpActive(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const notify = useCallback(
    (message) => {
      setToast(message);
      if (toastTimer) clearTimeout(toastTimer);
      const t = setTimeout(() => setToast(null), 2600);
      setToastTimer(t);
    },
    [toastTimer]
  );

  const adoptWpCart = useCallback((items) => {
    setCart(items && items.length ? items : []);
  }, []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item
          );
        }
        const prices = product.prices || {};
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images && product.images.length ? product.images[0].src : null,
            prices,
            qty,
          },
        ];
      });
      notify(`${product.name} is in your basket`);
      const token = wpTokenRef.current;
      if (!wpActive || !token) return;
      addCartItem(product.id, qty, token)
        .then(({ cart: wpCart }) => adoptWpCart(wpCart.items))
        .catch(() => {});
    },
    [notify, wpActive, adoptWpCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      const item = cart.find((i) => i.id === id);
      const key = item && item.key;
      setCart((prev) => prev.filter((i) => i.id !== id));
      const token = wpTokenRef.current;
      if (!wpActive || !token || !key) return;
      removeCartItem(key, token)
        .then(({ cart: wpCart }) => adoptWpCart(wpCart.items))
        .catch(() => {});
    },
    [cart, wpActive, adoptWpCart]
  );

  const updateQty = useCallback(
    (id, qty) => {
      if (qty <= 0) {
        removeFromCart(id);
        return;
      }
      const item = cart.find((i) => i.id === id);
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
      const token = wpTokenRef.current;
      if (!wpActive || !token || !item || !item.key) return;
      updateCartItem(item.key, qty, token)
        .then(({ cart: wpCart }) => adoptWpCart(wpCart.items))
        .catch(() => {});
    },
    [cart, wpActive, removeFromCart, adoptWpCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupons([]);
    setWcCartTotals(null);
    const token = wpTokenRef.current;
    if (!wpActive || !token) return;
    clearCartItems(token)
      .then(({ cart: wpCart }) => adoptWpCart(wpCart.items))
      .catch(() => {});
  }, [wpActive, adoptWpCart]);

  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [wcCartTotals, setWcCartTotals] = useState(null);

  const applyCoupon = useCallback(
    async (code) => {
      const token = wpTokenRef.current;
      if (!token) throw new Error('Could not connect to store.');
      const { cart: wpCart } = await wpApplyCoupon(code, token);
      adoptWpCart(normalizeCartItems(wpCart.items));
      setAppliedCoupons(wpCart.coupons || []);
      setWcCartTotals(wpCart.totals || null);
      notify(`Coupon "${code}" applied`);
      return wpCart;
    },
    [wpActive, adoptWpCart, notify]
  );

  const removeCoupon = useCallback(
    async (code) => {
      const token = wpTokenRef.current;
      if (!token) throw new Error('Could not connect to store.');
      const { cart: wpCart } = await wpRemoveCoupon(code, token);
      adoptWpCart(normalizeCartItems(wpCart.items));
      setAppliedCoupons(wpCart.coupons || []);
      setWcCartTotals(wpCart.totals || null);
      notify(`Coupon "${code}" removed`);
      return wpCart;
    },
    [wpActive, adoptWpCart, notify]
  );

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        const next = exists
          ? prev.filter((item) => item.id !== product.id)
          : [
              ...prev,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images && product.images.length ? product.images[0].src : null,
                prices: product.prices || {},
                categories: product.categories || [],
              },
            ];
        notify(
          exists
            ? 'Removed from your wishlist'
            : `${product.name} was added to your wishlist`
        );
        return next;
      });
    },
    [notify]
  );

  const isWishlisted = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const register = useCallback(
    ({ name, email, password }) => {
      const users = load(USERS_KEY) || [];
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: 'An account with that email already exists. Please sign in instead.' };
      }
      const nextUsers = [...users, { name, email, password }];
      save(USERS_KEY, nextUsers);
      setUser({ name, email });
      return { error: null };
    },
    []
  );

  const login = useCallback(
    ({ email, password }) => {
      const users = load(USERS_KEY) || [];
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found || found.password !== password) {
        return { error: 'The email or password is not correct.' };
      }
      setUser({ name: found.name, email: found.email });
      return { error: null };
    },
    []
  );

  const logout = useCallback(() => setUser(null), []);

  const cartCount = useMemo(() => cart.reduce((n, item) => n + item.qty, 0), [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unit = Number(item.prices?.price || item.prices?.regular_price || 0) / 100;
      return sum + unit * item.qty;
    }, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      wpActive,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      appliedCoupons,
      wcCartTotals,
      applyCoupon,
      removeCoupon,
      wishlist,
      toggleWishlist,
      isWishlisted,
      user,
      register,
      login,
      logout,
      toast,
      notify,
    }),
    [
      cart,
      cartCount,
      cartTotal,
      wpActive,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      appliedCoupons,
      wcCartTotals,
      applyCoupon,
      removeCoupon,
      wishlist,
      toggleWishlist,
      isWishlisted,
      user,
      register,
      login,
      logout,
      toast,
      notify,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useShop() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
