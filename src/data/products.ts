export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageLabel: string;
};

export const products: Product[] = [
  {
    id: "chaos-coin",
    name: "Chaos Coin",
    description: "A pocket-sized decision maker for questionable moments.",
    price: 6.5,
    stock: 12,
    imageLabel: "CC",
  },
  {
    id: "debug-duck",
    name: "Debug Duck",
    description: "Listens patiently while you explain why the code is definitely haunted.",
    price: 9.99,
    stock: 8,
    imageLabel: "DD",
  },
  {
    id: "keyboard-goblin",
    name: "Keyboard Goblin",
    description: "Probably responsible for the typo you swear you did not make.",
    price: 12.0,
    stock: 5,
    imageLabel: "KG",
  },
  {
    id: "bag-clip-of-holding",
    name: "Bag Clip of Holding",
    description: "Seals snacks with unnecessary dramatic importance.",
    price: 4.75,
    stock: 20,
    imageLabel: "BH",
  },
  {
    id: "deployment-chicken",
    name: "Rubber Chicken of Deployment",
    description: "Out of stock because someone deployed on Friday.",
    price: 14.25,
    stock: 0,
    imageLabel: "RC",
  },
];
