export interface FAQ {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface FAQCategory {
  name: string;
  faqs: FAQ[];
}

export const faqs: FAQCategory[] = [
  {
    name: "Menu & Drinks",
    faqs: [
      {
        id: "q1",
        question: "Is Jain food available in BBQ nation?",
        answer: "Yes, surely assist with information, can I know no. of pax looking for Jain food, is that you're looking for lunch or dinner. According to the information given by guest, Yes we have Jain food available but variety will be limited and once you reach to outlet you should inform to outlet team on Jain food, shall I proceed for reservation",
        tags: ["menu", "jain food", "dietary", "reservation"]
      },
      {
        id: "q2",
        question: "Does Barbeque Nation serve Halal food?",
        answer: "Sir/Mam, Yes we serve Halal food (Meat) in all the barbeque nation outlets.",
        tags: ["menu", "halal", "meat", "dietary"]
      },
      {
        id: "q3",
        question: "Do you have any proof / Certificate for Halal?",
        answer: "Mam/Sir, We do have certificate in all the barbeque nation outlets.",
        tags: ["menu", "halal", "certificate", "compliance"]
      },
      {
        id: "q4",
        question: "What is the menu for today?",
        answer: "Surely Mam/Sir, I will assist with information:- Inform the menu as per altius / Menu details in KP",
        tags: ["menu", "today", "current"]
      },
      {
        id: "q5",
        question: "Is outside Alcoholic drink allowed in Barbeque Nation outlets?",
        answer: "Mam/Sir, I'm sorry to inform outside drinks are not allowed in Barbeque Nation. However we serve drinks in barbeque nation as per ala carte menu",
        tags: ["drinks", "alcohol", "outside food", "policy"]
      },
      {
        id: "q6",
        question: "Can I get the drinks details through mail?",
        answer: "Yes mam/sir, (1.) I would request you to download barbeque nation app and click on menu, you can view the drinks menu (2.)Please provide your mail ID, we will send drinks details",
        tags: ["drinks", "email", "app", "menu details"]
      },
      {
        id: "q7",
        question: "Does Barbeque nation have alcohol? If yes then can I pay bill separately?",
        answer: "Mam/Sir, for dine-in services we do serve alcohol but it's not available for delivery services",
        tags: ["drinks", "alcohol", "billing", "delivery"]
      },
      {
        id: "q8",
        question: "Can I get particular dish once again? Can I customize the menu?",
        answer: "Mam/Sir , if you want any change in menu like taste , spicy or less spicy changes can be made. But if you want additional dish apart from menu need to check with branch as per availability you will get.",
        tags: ["menu", "customization", "special request", "additional dish"]
      },
      {
        id: "q9",
        question: "Does Menu remain same for all the outlets?",
        answer: "Yes,mam/sir menu is standard across all branches of barbeque nation",
        tags: ["menu", "standardization", "outlets"]
      },
      {
        id: "q10",
        question: "What type of fish do Barbeque nation serve?",
        answer: "Mam/Sir, We serve BASA fish which is boneless fish",
        tags: ["menu", "fish", "seafood"]
      },
      {
        id: "q11",
        question: "What type of prawns do barbeque nation serve?",
        answer: "Mam/Sir, we serve Medium size prawns which is called as Zinga prawns",
        tags: ["menu", "prawns", "seafood"]
      },
      {
        id: "q12",
        question: "What are the types of Ice-cream do barbeque nation serve?",
        answer: "Mam/Sir, We serve two flavor of ice cream that is Vanilla and strawberry.",
        tags: ["menu", "dessert", "ice cream"]
      },
      {
        id: "q13",
        question: "Flavor of Kulfis",
        answer: "Mam/Sir, We serve six flavor of kulfis that is Strawberry, Malai, Chocolate, Kesar badam, Paan, Mango",
        tags: ["menu", "dessert", "kulfi"]
      },
      {
        id: "q14",
        question: "Is their any change in menu?",
        answer: "Mam/Sir, The menu remains same as before.",
        tags: ["menu", "changes"]
      },
      {
        id: "q15",
        question: "What type of briyani do you serve? Will I get mutton briyani?",
        answer: "Mam/Sir, We serve chicken and veg biryani only.",
        tags: ["menu", "biryani", "rice"]
      },
      {
        id: "q16",
        question: "Do you serve alcoholic drinks in barbeque nation?",
        answer: "Mam/Sir, Provide information as per altius update for alcoholic drinks (drinks are served as per ala carte menu)",
        tags: ["drinks", "alcohol", "ala carte"]
      },
      {
        id: "q17",
        question: "Can I have only drinks in barbeque nation? And can I pay only for drinks?",
        answer: "Mam/Sir, Sorry to inform you sir/mam, Only drinks cannot be served.",
        tags: ["drinks", "policy", "payment"]
      },
      {
        id: "q18",
        question: "Do you serve Kulcha, roti, naan roti?",
        answer: "Mam/Sir Yes, we do serve",
        tags: ["menu", "bread", "roti"]
      },
      {
        id: "q19",
        question: "Is Pizza available in menu?",
        answer: "Mam/Sir, sorry to inform Pizza is not available in menu",
        tags: ["menu", "pizza", "unavailable"]
      },
      {
        id: "q20",
        question: "Is Hukkah available in barbeque nation outlet?",
        answer: "Mam/Sir, sorry to inform Hukkah is not available in barbeque nation outlets.",
        tags: ["hukkah", "smoking", "policy"]
      },
      {
        id: "q21",
        question: "Do we serve jataka food in barbeque nation?",
        answer: "Sir/Mam, surely we will assist with infromation.we don't serve jataka food in barbeque nation",
        tags: ["menu", "jataka", "dietary"]
      },
      {
        id: "q22",
        question: "What type of mutton we serve?",
        answer: "Sir/Mam, We serve mutton as a tender meat.",
        tags: ["menu", "mutton", "meat"]
      },
      {
        id: "q23",
        question: "Does barbeque nation serve goat meat?",
        answer: "Sir/Mam, we serve goat for mutton",
        tags: ["menu", "goat", "meat", "mutton"]
      },
      {
        id: "q24",
        question: "Do we have Crab in Menu?",
        answer: "Sir/Mam, We don't have crab currently only Fish, Prawn we have in Sea food.",
        tags: ["menu", "crab", "seafood", "unavailable"]
      }
    ]
  }
];

export const getFAQsByCategory = (category: string): FAQ[] => {
  const foundCategory = faqs.find(cat => cat.name.toLowerCase() === category.toLowerCase());
  return foundCategory?.faqs || [];
};

export const getFAQsByTags = (tags: string[]): FAQ[] => {
  return faqs.flatMap(category => 
    category.faqs.filter(faq => 
      tags.some(tag => faq.tags.includes(tag.toLowerCase()))
    )
  );
};

export const searchFAQs = (query: string): FAQ[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqs.flatMap(category => 
    category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(lowercaseQuery) || 
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.tags.some(tag => tag.includes(lowercaseQuery))
    )
  );
}; 