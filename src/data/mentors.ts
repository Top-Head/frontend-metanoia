export type MentorCategory =
  | "Tecnologia"
  | "Psicologia"
  | "Artes"
  | "Negócios"
  | "Ciências";

export interface Mentor {
  id: number;
  name: string;
  role: string;
  category: MentorCategory;
  rating: number;
  reviews: number;
  price: number;
  skills: string[];
  image: string;
}

export const MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Engenheira de Software Sênior",
    category: "Tecnologia",
    rating: 4.9,
    reviews: 120,
    price: 85_000,
    skills: ["REACT", "DESIGN DE SISTEMAS", "COACHING DE CARREIRA"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEcFCh6bzW1dKg51-GWetLbPRRmhcQz_HngIbwOOTnbXoIbXeN8pgZ3IlzEdEbA0YxvPeNIIRX_7N-r73GQWqSETC-ddBHAZgurHQg-tRi7qrprReoozmzuLnp77c_LDcvB3SiNrRhMip2WJPpvwO2Bym8_ByiUgxVA_ADtQQ1jvkhKrtiyDTRsVx72Cf8AqbSkS5i-0-414n5AKjSFQVSAzJOlIVZQ8Ya9IRNfpImmbQOj-GMyKedlrsTb9ELsqvSxwlLPOEFX48",
  },
  {
    id: 2,
    name: "Dr. Aris Thorne",
    role: "Psicólogo Clínico",
    category: "Psicologia",
    rating: 5.0,
    reviews: 84,
    price: 120_000,
    skills: ["CIÊNCIA COMPORTAMENTAL", "MINDFULNESS"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoA2jFTAmP5Lzj1flWara7-vcvBGxUBPuQibRgeImNHGqLYWY5DAvnmsXBDLC0oPecQLyXX341Vrvk2M8P1u0i-edeM92ZXwFWvjWDLZUtvjilMHpTZ4_O9J51Pr2-aO6kLnZp0Ew8uy91aYmQNy13nwkzRcLY9m1OItGQERGron79QRFx_jQWHXmct_B_nhdAHPs-k190FrhOEMJXo_ROCSxvBfp4H5d4aUBb1GZGu0ZTAOsPOYAJflKXw-GYZBSzMlQoDnTyZlY",
  },
  {
    id: 3,
    name: "Marcus Vane",
    role: "Ilustrador Digital",
    category: "Artes",
    rating: 4.8,
    reviews: 215,
    price: 65_000,
    skills: ["ARTE CONCEITUAL", "PROCREATE", "BRANDING"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz7lMIwlPGz1-_Aq8nGpbjHsiiCQ_KL0YtHFdA7vGW3g0u-UwBHD8QKbjMHCYFFwrQsQJYHssat7by5pwm-hxlCYvIAciqVHZQIJRnC0yWJBZLMvSotM7jz7SdLAsaW11huk6GnkfOBkRmZh_7565M2s9tT4P3LZurwAzdpYj-3H7u6Yel_M5bTVcS_SuUvN3B_YSrcPQTdbJup8yHlRQ0XgSxr6f00iXhDO7h5a8bkcB7ynwKCqMw76vtXz_w9v88SwEcnQ50gr8",
  },
  {
    id: 4,
    name: "Julian Rivera",
    role: "Investidor de Risco",
    category: "Negócios",
    rating: 4.7,
    reviews: 56,
    price: 150_000,
    skills: ["CAPTAÇÃO DE RECURSOS", "SCALEUPS"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdlWAIVWN85kPfwfq5TTizErRNBHMufQlLIPJlQtEY9rSb8JB1Zd6gMcNSNaZXORFFEdNXBsr5ZkJN16EoJMVi0IYbp-uyYfdumMdZQMwSOGxEhDXY_ilXPMC7mVgZUstx4ZSyNIR2uzVHaBq4W8nQ0_4jrPlCRqi2HvtTNGomUuzxQ8GJ5Jk8pNgLXecKEOSfbdr2B85emtEWrm-mVPS7EdmvRfLabQzagT3SJkZYDCwuFIQ6fv7lT6o3xE7A8bJ6qIC8kOjIn6A",
  },
  {
    id: 5,
    name: "Elena Rostova",
    role: "Designer UI/UX",
    category: "Tecnologia",
    rating: 4.9,
    reviews: 18,
    price: 70_000,
    skills: ["FIGMA", "PESQUISA COM USUÁRIO", "PROTOTIPAGEM"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjn8tuL_suZtaoxuEuH5SzFcJkXIY1Q5j4o-s4Z8sshQikPW1FDUnPCemDi7v9S3_SUqfHUFohWaOspl25LxwpgcqnWxYP44KpKjknHusoe1NcEdY85El9tavB-tqSfAApr1r_ZyKWWs6AHPd0tLsEHCKsU3nHH-os8lE4DS5r9R9QIBPcFBAzV2eVayTPaOh8IOg90UfSE27k9PeHB2wpqr152QEl-fya2gAF-ps3ipXS6jxTtl7BMBtrShn4oeF0O7ZgkBe_MWs",
  },
  {
    id: 6,
    name: "Thomas Wright",
    role: "Cientista de Dados",
    category: "Ciências",
    rating: 4.6,
    reviews: 42,
    price: 95_000,
    skills: ["PYTHON", "MACHINE LEARNING"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDF-0S5fd1AjZl0-6lEGRvLLRjvIgxL4pGT9zkGp-qVowgM4Y2HN9KWIQfKesMhEsvr1O3acRJ91nFN_2IQlaGUYgHeUxkw1z4rncsg24Hknow_5PHMYn-OOzNYXRZVfDlP36c8jdlkXmG_19y8SPzvVQziuQBI1aRAmxW75oARTdX6Y9P07wiVNH8C95ctbH5SJwZ8KKLRFyhoL24sIS7K05g6uH_21LwTO0WNUoQyuUgoxv-PQaQZww71-ullponySzU4mxwOU7U",
  },
  {
    id: 7,
    name: "Ana Beatriz Santos",
    role: "Product Manager",
    category: "Negócios",
    rating: 4.8,
    reviews: 93,
    price: 110_000,
    skills: ["GESTÃO DE PRODUTO", "AGILE", "DATA-DRIVEN"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoA2jFTAmP5Lzj1flWara7-vcvBGxUBPuQibRgeImNHGqLYWY5DAvnmsXBDLC0oPecQLyXX341Vrvk2M8P1u0i-edeM92ZXwFWvjWDLZUtvjilMHpTZ4_O9J51Pr2-aO6kLnZp0Ew8uy91aYmQNy13nwkzRcLY9m1OItGQERGron79QRFx_jQWHXmct_B_nhdAHPs-k190FrhOEMJXo_ROCSxvBfp4H5d4aUBb1GZGu0ZTAOsPOYAJflKXw-GYZBSzMlQoDnTyZlY",
  },
  {
    id: 8,
    name: "Lucas Ferreira",
    role: "Desenvolvedor Full Stack",
    category: "Tecnologia",
    rating: 4.7,
    reviews: 67,
    price: 90_000,
    skills: ["NEXT.JS", "TYPESCRIPT", "NODE"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz7lMIwlPGz1-_Aq8nGpbjHsiiCQ_KL0YtHFdA7vGW3g0u-UwBHD8QKbjMHCYFFwrQsQJYHssat7by5pwm-hxlCYvIAciqVHZQIJRnC0yWJBZLMvSotM7jz7SdLAsaW11huk6GnkfOBkRmZh_7565M2s9tT4P3LZurwAzdpYj-3H7u6Yel_M5bTVcS_SuUvN3B_YSrcPQTdbJup8yHlRQ0XgSxr6f00iXhDO7h5a8bkcB7ynwKCqMw76vtXz_w9v88SwEcnQ50gr8",
  },
  {
    id: 9,
    name: "Camila Rocha",
    role: "Psicóloga Organizacional",
    category: "Psicologia",
    rating: 4.9,
    reviews: 112,
    price: 100_000,
    skills: ["LIDERANÇA", "BEM-ESTAR CORPORATIVO", "PNL"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdlWAIVWN85kPfwfq5TTizErRNBHMufQlLIPJlQtEY9rSb8JB1Zd6gMcNSNaZXORFFEdNXBsr5ZkJN16EoJMVi0IYbp-uyYfdumMdZQMwSOGxEhDXY_ilXPMC7mVgZUstx4ZSyNIR2uzVHaBq4W8nQ0_4jrPlCRqi2HvtTNGomUuzxQ8GJ5Jk8pNgLXecKEOSfbdr2B85emtEWrm-mVPS7EdmvRfLabQzagT3SJkZYDCwuFIQ6fv7lT6o3xE7A8bJ6qIC8kOjIn6A",
  },
  {
    id: 10,
    name: "Rafael Mendes",
    role: "Diretor de Arte",
    category: "Artes",
    rating: 4.5,
    reviews: 38,
    price: 130_000,
    skills: ["MOTION DESIGN", "AFTER EFFECTS", "BRAND IDENTITY"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjn8tuL_suZtaoxuEuH5SzFcJkXIY1Q5j4o-s4Z8sshQikPW1FDUnPCemDi7v9S3_SUqfHUFohWaOspl25LxwpgcqnWxYP44KpKjknHusoe1NcEdY85El9tavB-tqSfAApr1r_ZyKWWs6AHPd0tLsEHCKsU3nHH-os8lE4DS5r9R9QIBPcFBAzV2eVayTPaOh8IOg90UfSE27k9PeHB2wpqr152QEl-fya2gAF-ps3ipXS6jxTtl7BMBtrShn4oeF0O7ZgkBe_MWs",
  },
  {
    id: 11,
    name: "Fernanda Lima",
    role: "Neurocientista",
    category: "Ciências",
    rating: 4.8,
    reviews: 55,
    price: 140_000,
    skills: ["NEUROCIÊNCIA", "COGNITIVO", "PESQUISA"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEcFCh6bzW1dKg51-GWetLbPRRmhcQz_HngIbwOOTnbXoIbXeN8pgZ3IlzEdEbA0YxvPeNIIRX_7N-r73GQWqSETC-ddBHAZgurHQg-tRi7qrprReoozmzuLnp77c_LDcvB3SiNrRhMip2WJPpvwO2Bym8_ByiUgxVA_ADtQQ1jvkhKrtiyDTRsVx72Cf8AqbSkS5i-0-414n5AKjSFQVSAzJOlIVZQ8Ya9IRNfpImmbQOj-GMyKedlrsTb9ELsqvSxwlLPOEFX48",
  },
  {
    id: 12,
    name: "Pedro Almeida",
    role: "Empreendedor Serial",
    category: "Negócios",
    rating: 4.6,
    reviews: 78,
    price: 160_000,
    skills: ["STARTUPS", "PITCH", "GESTÃO FINANCEIRA"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDF-0S5fd1AjZl0-6lEGRvLLRjvIgxL4pGT9zkGp-qVowgM4Y2HN9KWIQfKesMhEsvr1O3acRJ91nFN_2IQlaGUYgHeUxkw1z4rncsg24Hknow_5PHMYn-OOzNYXRZVfDlP36c8jdlkXmG_19y8SPzvVQziuQBI1aRAmxW75oARTdX6Y9P07wiVNH8C95ctbH5SJwZ8KKLRFyhoL24sIS7K05g6uH_21LwTO0WNUoQyuUgoxv-PQaQZww71-ullponySzU4mxwOU7U",
  },
];