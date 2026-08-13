// Original category introductions shown above each live product grid.
// Written fresh for Florence Dolls only.

export const CATEGORY_DESCRIPTIONS = {
  'reborn-dolls': {
    title: 'Genuine Reborn Baby Dolls',
    intro:
      'Every reborn doll in this corner of the shop has been chosen the way we would choose one for our own family \u2014 for honest materials, thoughtful finishing and a face you fall for. These are not toys in the ordinary sense; they are crafted dolls that ask to be held, dressed and taken gently under the arm on the school run.',
    body:
      'Our reborn dolls are genuine pieces from Arias and Llorens, two names that have spent decades perfecting the softness of a doll that feels properly like a baby. Because all stock is held here in the UK, the doll you say yes to today can be carefully packed and on its way within our usual quick delivery window. Whether you are beginning a collection or adding a special new arrival to one, you can hold a real handful of joy in your arms soon.',
  },
  'doll-prams-and-pushchairs': {
    title: 'Dolls On the Move',
    intro:
      'Once you have a reborn doll you love, the natural next step is somewhere lovely to push it. Our prams and pushchairs hold exactly that \u2014 sturdy frames, soft fabrics and a design made to be wheeled around the streets, the park and the grandparents\u2019 hallway with pride.',
    body:
      'We look after this range the same way we look after every piece in the shop, which means only sets that fold, steer and feel properly built earn a place. They arrive quickly and securely packed, ready to become the setting of a thousand small adventures once they reach your door.',
  },
  'doll-furniture': {
    title: 'A Corner of Their Own',
    intro:
      'The right furniture turns a well-loved doll into part of the household \u2014 a cot by the bed, a chair beside the hearth \u2014 and our furniture range is chosen to feel at home in a real room. Expect gentle lines, sturdy build and details thoughtful enough to match the dolls themselves.',
    body:
      'From cradle to seating, each piece is held in UK stock so your little corner of the world is rarely far away. We pack everything with care so the only surprise, once it arrives, is how exactly it settles into its new space.',
  },
  'doll-accessories': {
    title: 'The Little Finishing Touches',
    intro:
      'The last few inches of a doll\u2019s personality live not in the body but in the tiny extras that dress it \u2014 a coat that comes off and on, a carrycot for the trip home, a blanket too soft to put down. Our accessories are boutique-finished and gathered together the way we would have gifted them ourselves.',
    body:
      'This is the drawer of the shop we most enjoy tending, because it is quietly particular. Everything here is chosen to genuinely complete a piece rather than purely pile up, and everything ships from UK stock with the same careful packaging and prompt delivery as any larger order.',
  },
};

export function getCategoryDescription(slug) {
  return CATEGORY_DESCRIPTIONS[slug] || null;
}