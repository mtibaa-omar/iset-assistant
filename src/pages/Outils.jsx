import { 
  HiBriefcase, 
  HiChevronRight, 
  HiWrenchScrewdriver,
  HiLink
} from "react-icons/hi2";
import { 
  BsFileEarmarkPdfFill, 
} from "react-icons/bs";
import { FaRegFileWord, FaMicrosoft } from "react-icons/fa";
import { IoDocumentTextOutline, IoSparklesSharp, IoColorPaletteOutline } from "react-icons/io5";
import { SiGrammarly, SiNotion, SiOverleaf, SiCanva, SiDeepl, SiPerplexity, SiKahoot, SiQuizlet } from "react-icons/si";

const categories = [
  {
    title: "Stage",
    icon: HiBriefcase,
    gradient: "from-blue-500 to-indigo-600",
    tools: [
      {
        title: "Guide du rapport de stage d’initiation iset Sfax",
        description: "Guide et ressources pour le stage d'initiation (1ère année).",
        type: "Word",
        link: "https://drive.google.com/file/d/1JdBpnp8Kg9O9DkJP3Za91TbQCW_MnYU5/view?usp=drive_link",
        external:true
      },
      {
        title: "Guide du rapport de stage d’initiation iset kef",
        description: "Guide et ressources pour le stage d'initiation (1ère année).",
        type: "PDF",
        link: "https://drive.google.com/file/d/1E86Px62rUFodmydpc-sa76zn-0WA92AS/view?usp=drive_link",
        external:true
      },
      {
        title: "Guide du rapport de stage de perfectionnement iset kef",
        description: "Guide et ressources pour le stage de perfectionnement (2ème année).",
        type: "PDF",
        link: "https://drive.google.com/file/d/1vYdhtbx7CsrBWTQwdh2652Chx4v8wTWl/view?usp=drive_link",
        external:true
      },
      {
        title: "Guide  du rapport de stage de perfectionnement iset sousse",
        description: "Guide et ressources pour le stage de perfectionnement (2ème année).",
        type: "PDF",
        link: "https://drive.google.com/file/d/1TYMZjI1UF5zLYN_CesVwwGZhmA82o2w1/view?usp=drive_link",
        external:true
      },
      {
        title: "Guide  du rapport de stage d'initiation iset Gafsa",
        description: "Guide et ressources pour le stage d'initiation (1ère année).",
        type: "PDF",
        link: "https://drive.google.com/file/d/1N23bV6uaMiDjRBPBwqrEuJJxgulfM52G/view?usp=drive_link",
        external:true
      },
      {
        title: "Cahier de stage obligatoire",
        description: "Le carnet de suivi indispensable pour valider votre stage (1ère & 2ème année).",
        type: "Docs",
        link: "https://docs.google.com/document/d/1gaoejFyiyehxgth3_dX8zln-mL5lfTdG/edit?usp=drive_link&ouid=106331717671578697082&rtpof=true&sd=true",
        external:true
      },
      {
        title: "Page de garde Rapport de stage obligatoire Initiation perfectionnement",
        description: "Modèle officiel de la page de garde pour vos rapports de stage.",
        type: "Docs",
        link: "https://docs.google.com/document/d/1Ae0m9e_e6VHX3b2J-AF1DU8oCW6IYxB9/edit?usp=drive_link&ouid=106331717671578697082&rtpof=true&sd=true",
        external:true
      },
    ]
  },
  {
    title: "IA & Productivité",
    icon: IoSparklesSharp,
    gradient: "from-purple-500 to-pink-600",
    tools: [
      {
        title: "Grammarly",
        description: "Peaufinez vos rapports : grammaire, clarté et réécriture (Web, Docs, Word).",
        type: "IA",
        link: "https://www.grammarly.com",
        external: true
      },
      {
        title: "Microsoft Copilot",
        description: "Résumé et réécriture intelligente directement dans Microsoft Word.",
        type: "IA",
        link: "https://copilot.microsoft.com",
        external: true
      },
      {
        title: "Notion AI",
        description: "Transformez vos notes en résumés clairs et points clés structurés.",
        type: "IA",
        link: "https://www.notion.so/product/ai",
        external: true
      },
      {
        title: "DeepL",
        description: "Traduction de haute qualité pour vos textes et documents complets.",
        type: "IA",
        link: "https://www.deepl.com",
        external: true
      },
      {
        title: "Perplexity",
        description: "Moteur de recherche IA avec citations de sources pour vos recherches.",
        type: "IA",
        link: "https://www.perplexity.ai",
        external: true
      },
      {
        title: "Quizlet",
        description: "Générez des tests d'entraînement personnalisés à partir de vos notes.",
        type: "IA",
        link: "https://quizlet.com",
        external: true
      },
      {
        title: "Kahoot!",
        description: "Créez rapidement des quiz interactifs pour réviser seul ou à plusieurs.",
        type: "IA",
        link: "https://kahoot.com",
        external: true
      }
    ]
  },
  {
    title: "Rédaction & Design",
    icon: IoColorPaletteOutline,
    gradient: "from-emerald-500 to-teal-600",
    tools: [
      {
        title: "LaTeX (Overleaf)",
        description: "Éditeur LaTeX collaboratif pour des rapports académiques professionnels.",
        type: "LATEX",
        link: "https://www.overleaf.com",
        external: true
      },
      {
        title: "Modèle de Rapport (Canva)",
        description: "Créez un rapport de stage professionnel avec nos templates personnalisables.",
        type: "CANVA",
        link: "https://www.canva.com",
        external: true
      }
    ]
  }
];

const getIconForType = (type, title) => {
  const upperType = type.toUpperCase();
  const lowerTitle = title.toLowerCase();

  switch (upperType) {
    case "PDF":
      return <BsFileEarmarkPdfFill className="w-6 h-6 text-red-500" />;
    case "WORD":
      return <FaRegFileWord className="w-6 h-6 text-blue-600" />;
    case "IA":
      if (lowerTitle.includes("grammarly")) return <SiGrammarly className="w-6 h-6 text-emerald-500" />;
      if (lowerTitle.includes("notion")) return <SiNotion className="w-6 h-6 text-slate-800 dark:text-white" />;
      if (lowerTitle.includes("copilot")) return <FaMicrosoft className="w-6 h-6 text-blue-500" />;
      if (lowerTitle.includes("deepl")) return <SiDeepl className="w-6 h-6 text-blue-700" />;
      if (lowerTitle.includes("perplexity")) return <SiPerplexity className="w-6 h-6 text-cyan-500" />;
      if (lowerTitle.includes("quizlet")) return <SiQuizlet className="w-6 h-6 text-blue-400" />;
      if (lowerTitle.includes("kahoot")) return <SiKahoot className="w-6 h-6 text-purple-600" />;
      return <IoSparklesSharp className="w-6 h-6 text-purple-500" />;
    case "LATEX":
      return <SiOverleaf className="w-6 h-6 text-emerald-600" />;
    case "CANVA":
      return <SiCanva className="w-6 h-6 text-green-700" />;
    case "LIEN":
      return <HiLink className="w-6 h-6 text-amber-500" />;
    default:
      return <IoDocumentTextOutline className="w-6 h-6 text-slate-400" />;
  }
};

const ToolCard = ({ tool }) => {
  return (
    <a
      href={tool.link}
      target={tool.external ? "_blank" : "_self"}
      rel={tool.external ? "noopener noreferrer" : ""}
      className="group flex flex-col p-3 md:p-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-500/30  duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl group-hover:scale-110 transition-transform">
          {getIconForType(tool.type, tool.title)}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
          tool.type === "PDF" ? "border-red-200 text-red-600 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20" :
          tool.type === "Word" || tool.type === "Docs" ? "border-blue-200 text-blue-600 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20" :
          tool.type === "IA" ? "border-purple-200 text-purple-600 bg-purple-50 dark:border-purple-900/50 dark:bg-purple-900/20" :
          tool.type === "LATEX" || tool.type === "Canva" || tool.type === "CANVA" ? "border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20" :
          tool.type === "Lien" ? "border-amber-200 text-amber-600 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20" :
          "border-slate-200 text-slate-600 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50"
        }`}>
          {tool.type}
        </span>
      </div>
      
      <h3 className="text-[12px] md:text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
        {tool.title}
      </h3>
      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-tight mb-3 flex-grow line-clamp-2">
        {tool.description}
      </p>
      
      <div className="flex items-center justify-between text-[10px] font-semibold pt-2 border-t border-slate-100 dark:border-white/5">
        <span className="text-slate-400 dark:text-slate-500 truncate">
          {tool.external ? "Lien externe" : "Télécharger"}
        </span>
        <div className="flex items-center text-purple-600 dark:text-purple-400">
          <HiChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </a>
  );
};

export default function Outils() {
  return (
    <div className="overflow-y-auto px-4 md:px-6 lg:px-10 pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
            <HiWrenchScrewdriver className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">
            Boite à Outils
          </h1>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-gradient-to-br ${category.gradient} rounded-lg shadow-sm w-10 h-10 flex items-center justify-center`}>
                <category.icon className="w-5.5 h-5.5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  {category.title}
                </h2>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-4 lg:gap-5">
              {category.tools.map((tool) => (
                <ToolCard key={tool.title} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}