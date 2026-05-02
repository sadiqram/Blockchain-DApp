export type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;

  // marketplace fields
  isListed: boolean;
  price?: string;
  seller?: string;
};
