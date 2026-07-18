/**
 * Typed static translation dictionary for the interface chrome (everything
 * except the ID-keyed content in content.ts). English is the fallback; Italian
 * is a static, human-authored translation. No i18n library is used.
 */

import type { Locale } from "./locale";

export interface Messages {
  switcher: {
    ariaLabel: string;
    en: string;
    it: string;
  };
  header: {
    frameworkAttribution: string;
  };
  footer: {
    createdDuring: string;
    betaBadge: string;
    text: string;
  };
  landing: {
    kicker: string;
    lede: string;
    getStarted: string;
    answerTitle: string;
    answerBodyBefore: string;
    answerBodyAfter: string;
    tryDemo: string;
    teachersTitle: string;
    teachersBody: string;
    teacherSignIn: string;
    createTestAccount: string;
    privacyLink: string;
  };
  privacy: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    backToHome: string;
  };
  auth: {
    signInTitle: string;
    signInLede: string;
    signupTitle: string;
    signupLede: string;
    emailLabel: string;
    passwordLabel: string;
    signInButton: string;
    signingIn: string;
    createAccountButton: string;
    creatingAccount: string;
    noAccountPrompt: string;
    createAccountLink: string;
    haveAccountPrompt: string;
    signInLink: string;
    genericSignInError: string;
    genericSignUpError: string;
    signupValidationError: string;
    confirmEmailNotice: string;
  };
  dashboard: {
    yourCampaigns: string;
    signedInAs: (email: string) => string;
    signOut: string;
    createCampaign: string;
    creating: string;
    titleLabel: string;
    classNameLabel: string;
    expectedLabel: string;
    thresholdLabel: string;
    languageLabel: string;
    langEnglish: string;
    langItalian: string;
    noCampaigns: string;
    campaignMeta: (klass: string, threshold: number, expected: number) => string;
    startRoundPlaceholder: string;
    startRoundAria: string;
    startNewRound: string;
    noRounds: string;
    responses: (count: number) => string;
    live: string;
    closed: string;
    copyStudentLink: string;
    copied: string;
    openResults: string;
    closeRound: string;
    reopenRound: string;
    errorTitleClass: string;
    errorExpected: string;
    errorThresholdRange: string;
    errorThresholdExceedsExpected: string;
    errorLanguage: string;
    errorCreateFailed: string;
  };
  roundResults: {
    unavailableTitle: string;
    unavailableBody: string;
    backToCampaigns: string;
    refreshResults: string;
    refreshing: string;
    closeRound: string;
    reopenRound: string;
  };
  teacherDashboard: {
    demoBadge: string;
    live: string;
    closed: string;
    draft: string;
    responses: string;
    participation: string;
    anonymityThreshold: string;
    lastUpdated: string;
    thresholdResponsesUnit: (threshold: number) => string;
    thresholdNoticeTitle: string;
    thresholdNoticeBody: (threshold: number, count: number) => string;
    thresholdRemaining: (remaining: number) => string;
    sectionOverview: string;
    overall: string;
    selectedSectionStatus: (
      name: string,
      percent: number,
      label: string,
    ) => string;
    collectiveInterpretation: string;
    suggestedActions: string;
    sectionPercentage: string;
    rawAverage: string;
    validResponses: string;
    distributionCaption: string;
    colAnswer: string;
    colResponses: string;
    colPercentage: string;
    percentWord: string;
    responseDistribution: string;
    fromCentreOutward: string;
    innermost: string;
    outermost: string;
    selectSection: string;
    wheelAriaLabel: string;
    reassessDefault: string;
    /** Demo fixture only — example reassessment timing label. */
    exampleNextCheckIn: string;
  };
  student: {
    welcomeHeading: string;
    welcomeIntro: string;
    reassurances: readonly [string, string, string, string, string];
    startButton: string;
    progress: (current: number, total: number) => string;
    answerGroupLabel: string;
    back: string;
    next: string;
    submit: string;
    sending: string;
    completionHeading: string;
    completionMessage: string;
    completionCollective: string;
    completionSupport: string;
    homeLink: string;
    submitError: string;
    unavailableTitle: string;
    unavailableBody: string;
  };
}

const en: Messages = {
  switcher: {
    ariaLabel: "Interface language",
    en: "EN",
    it: "IT",
  },
  header: {
    frameworkAttribution:
      "Based on the Center for Neuro-Innovation and Performance framework",
  },
  footer: {
    createdDuring: "Created and grounded in team personal experience during",
    betaBadge: "Hackathon beta · ready to use",
    text: "Organised by EGInA in Cascia, Italy. StressAid is a privacy-first school environment feedback tool.",
  },
  landing: {
    kicker: "Social Hackathon Umbria 2026 — MVP",
    lede: "StressAid is a privacy-first school environment feedback tool. Students answer a short, anonymous questionnaire. Answers are combined at class level and shown to teachers as collective signals — never as individual results.",
    getStarted: "Get started",
    answerTitle: "Answer a questionnaire",
    answerBodyBefore: "Open the questionnaire link provided by your teacher. It looks like ",
    answerBodyAfter: ".",
    tryDemo: "Try the demo questionnaire",
    teachersTitle: "Teachers",
    teachersBody: "Sign in to create campaigns, start rounds, and view collective results.",
    teacherSignIn: "Teacher sign in",
    createTestAccount: "Create a teacher test account",
    privacyLink: "Privacy information",
  },
  privacy: {
    title: "Privacy",
    p1: "StressAid is designed to be privacy-first. It does not ask for a student’s name, email, student ID, date of birth, or any other identifying information.",
    p2: "Answers are combined at class level and shown to teachers only as collective signals. Individual responses are never shown.",
    p3: "This is a placeholder page. The full child-friendly notice and adult privacy information will be added in a later step.",
    backToHome: "Back to home",
  },
  auth: {
    signInTitle: "Teacher sign in",
    signInLede: "Sign in to manage your class campaigns and rounds.",
    signupTitle: "Create a teacher test account",
    signupLede: "Hackathon beta · ready to use.",
    emailLabel: "Email",
    passwordLabel: "Password",
    signInButton: "Sign in",
    signingIn: "Signing in…",
    createAccountButton: "Create account",
    creatingAccount: "Creating account…",
    noAccountPrompt: "No account yet?",
    createAccountLink: "Create a teacher test account",
    haveAccountPrompt: "Already have an account?",
    signInLink: "Sign in",
    genericSignInError:
      "We couldn't sign you in. Check your email and password and try again.",
    genericSignUpError:
      "We couldn't create your account right now. Please try again.",
    signupValidationError:
      "Enter a valid email and a password of at least 6 characters.",
    confirmEmailNotice:
      "Check your email to confirm your account, then return to sign in.",
  },
  dashboard: {
    yourCampaigns: "Your campaigns",
    signedInAs: (email) => `Signed in as ${email}`,
    signOut: "Sign out",
    createCampaign: "Create campaign",
    creating: "Creating…",
    titleLabel: "Title",
    classNameLabel: "Class name",
    expectedLabel: "Expected participants",
    thresholdLabel: "Anonymity threshold",
    languageLabel: "Language",
    langEnglish: "English",
    langItalian: "Italiano",
    noCampaigns:
      "You have no campaigns yet. Create one above to get your first round and student link.",
    campaignMeta: (klass, threshold, expected) =>
      `${klass} · threshold ${threshold} · expected ${expected}`,
    startRoundPlaceholder: "New round name (optional)",
    startRoundAria: "New round name",
    startNewRound: "Start new round",
    noRounds: "No rounds yet.",
    responses: (count) => `${count} responses`,
    live: "Live",
    closed: "Closed",
    copyStudentLink: "Copy student link",
    copied: "Copied!",
    openResults: "Open results",
    closeRound: "Close round",
    reopenRound: "Reopen round",
    errorTitleClass: "Please provide a title and a class name.",
    errorExpected: "Expected participants must be a positive whole number.",
    errorThresholdRange: "Anonymity threshold must be between 10 and 1000.",
    errorThresholdExceedsExpected:
      "Anonymity threshold cannot exceed expected participants.",
    errorLanguage: "Choose a supported language.",
    errorCreateFailed: "We couldn't create the campaign. Please try again.",
  },
  roundResults: {
    unavailableTitle: "Results unavailable",
    unavailableBody:
      "This round could not be found, or it does not belong to your account.",
    backToCampaigns: "Back to dashboard",
    refreshResults: "Refresh results",
    refreshing: "Refreshing…",
    closeRound: "Close round",
    reopenRound: "Reopen round",
  },
  teacherDashboard: {
    demoBadge: "Demo data · Synthetic class example",
    live: "Live",
    closed: "Closed",
    draft: "Draft",
    responses: "Responses",
    participation: "Participation",
    anonymityThreshold: "Anonymity threshold",
    lastUpdated: "Last updated",
    thresholdResponsesUnit: (threshold) => `${threshold} responses`,
    thresholdNoticeTitle: "Results are not available yet",
    thresholdNoticeBody: (threshold, count) =>
      `To protect student anonymity, collective results are shown only once at least ${threshold} responses have been received. This class currently has ${count} ${count === 1 ? "response" : "responses"}.`,
    thresholdRemaining: (remaining) =>
      `${
        remaining === 1
          ? "1 more response is needed before results can be shown."
          : `${remaining} more responses are needed before results can be shown.`
      } No section averages, distributions, interpretations, or the Class Environment Wheel are available until then.`,
    sectionOverview: "Section overview",
    overall: "Overall",
    selectedSectionStatus: (name, percent, label) =>
      `Selected section: ${name}, ${percent} percent, ${label}.`,
    collectiveInterpretation: "Collective interpretation",
    suggestedActions: "Suggested actions",
    sectionPercentage: "Section percentage",
    rawAverage: "Raw average (0–4)",
    validResponses: "Valid responses",
    distributionCaption: "Response distribution by answer category",
    colAnswer: "Answer",
    colResponses: "Responses",
    colPercentage: "Percentage",
    percentWord: "percent",
    responseDistribution: "Response distribution",
    fromCentreOutward: "From the centre outward",
    innermost: "innermost",
    outermost: "outermost",
    selectSection: "Select section.",
    wheelAriaLabel:
      "Class Environment Wheel. Six equal sections; each shows its response distribution from Never at the centre to Always at the outer edge. Select a section to view details.",
    reassessDefault: "Start a new round when you want to reassess this class.",
    exampleNextCheckIn: "Example next check-in: in six weeks",
  },
  student: {
    welcomeHeading: "Welcome!",
    welcomeIntro: "Your voice helps make our school a better place for everyone.",
    reassurances: [
      "No right or wrong answers",
      "We do not ask for your name",
      "Your answers are combined with your class",
      "Your teacher cannot see your individual answers",
      "About 2 minutes",
    ],
    startButton: "Start",
    progress: (current, total) => `Question ${current} of ${total}`,
    answerGroupLabel: "Choose one answer",
    back: "Back",
    next: "Next",
    submit: "Submit answers",
    sending: "Sending…",
    completionHeading: "Thank you!",
    completionMessage: "Your response has been recorded anonymously.",
    completionCollective:
      "Together, we can create a better school for all students.",
    completionSupport:
      "If something at school makes you feel unsafe, speak with a trusted adult or use your school’s official support channel.",
    homeLink: "Back to home",
    submitError:
      "We couldn't send your answers. Please check your connection and try again.",
    unavailableTitle: "This questionnaire isn’t available",
    unavailableBody:
      "The link may be incomplete, or this round is no longer open. Please check the link your teacher gave you.",
  },
};

const it: Messages = {
  switcher: {
    ariaLabel: "Lingua dell’interfaccia",
    en: "EN",
    it: "IT",
  },
  header: {
    frameworkAttribution:
      "Basato sul framework del Center for Neuro-Innovation and Performance",
  },
  footer: {
    createdDuring:
      "Creato e fondato sull’esperienza personale del team durante",
    betaBadge: "Beta hackathon · pronto all’uso",
    text: "Organizzato da EGInA a Cascia, Italia. StressAid è uno strumento di feedback sull’ambiente scolastico attento alla privacy.",
  },
  landing: {
    kicker: "Social Hackathon Umbria 2026 — MVP",
    lede: "StressAid è uno strumento di feedback sull’ambiente scolastico attento alla privacy. Gli studenti rispondono a un breve questionario anonimo. Le risposte vengono unite a livello di classe e mostrate agli insegnanti come segnali collettivi, mai come risultati individuali.",
    getStarted: "Inizia",
    answerTitle: "Rispondi a un questionario",
    answerBodyBefore: "Apri il link al questionario fornito dal tuo insegnante. Ha un formato simile a ",
    answerBodyAfter: ".",
    tryDemo: "Prova il questionario dimostrativo",
    teachersTitle: "Insegnanti",
    teachersBody: "Accedi per creare campagne, avviare rilevazioni e vedere i risultati collettivi.",
    teacherSignIn: "Accesso insegnanti",
    createTestAccount: "Crea un account insegnante di prova",
    privacyLink: "Informazioni sulla privacy",
  },
  privacy: {
    title: "Privacy",
    p1: "StressAid è progettato per essere attento alla privacy. Non richiede il nome dello studente, l’email, il numero di matricola, la data di nascita o qualsiasi altra informazione identificativa.",
    p2: "Le risposte vengono unite a livello di classe e mostrate agli insegnanti solo come segnali collettivi. Le risposte individuali non vengono mai mostrate.",
    p3: "Questa è una pagina segnaposto. L’informativa completa adatta ai bambini e le informazioni sulla privacy per gli adulti verranno aggiunte in un passaggio successivo.",
    backToHome: "Torna alla pagina iniziale",
  },
  auth: {
    signInTitle: "Accesso insegnanti",
    signInLede: "Accedi per gestire le campagne e le rilevazioni della tua classe.",
    signupTitle: "Crea un account insegnante di prova",
    signupLede: "Beta hackathon · pronto all’uso.",
    emailLabel: "Email",
    passwordLabel: "Password",
    signInButton: "Accedi",
    signingIn: "Accesso in corso…",
    createAccountButton: "Crea account",
    creatingAccount: "Creazione account…",
    noAccountPrompt: "Non hai ancora un account?",
    createAccountLink: "Crea un account insegnante di prova",
    haveAccountPrompt: "Hai già un account?",
    signInLink: "Accedi",
    genericSignInError:
      "Non è stato possibile accedere. Controlla l’email e la password e riprova.",
    genericSignUpError:
      "Non è stato possibile creare il tuo account in questo momento. Riprova.",
    signupValidationError:
      "Inserisci un’email valida e una password di almeno 6 caratteri.",
    confirmEmailNotice:
      "Controlla la tua email per confermare l’account, poi torna ad accedere.",
  },
  dashboard: {
    yourCampaigns: "Le tue campagne",
    signedInAs: (email) => `Accesso effettuato come ${email}`,
    signOut: "Esci",
    createCampaign: "Crea una campagna",
    creating: "Creazione…",
    titleLabel: "Titolo della campagna",
    classNameLabel: "Nome della classe",
    expectedLabel: "Partecipanti previsti",
    thresholdLabel: "Soglia di anonimato",
    languageLabel: "Lingua",
    langEnglish: "English",
    langItalian: "Italiano",
    noCampaigns:
      "Non hai ancora nessuna campagna. Creane una qui sopra per ottenere la tua prima rilevazione e il link per gli studenti.",
    campaignMeta: (klass, threshold, expected) =>
      `${klass} · soglia ${threshold} · previsti ${expected}`,
    startRoundPlaceholder: "Nome della nuova rilevazione (facoltativo)",
    startRoundAria: "Nome della nuova rilevazione",
    startNewRound: "Avvia una nuova rilevazione",
    noRounds: "Ancora nessuna rilevazione.",
    responses: (count) => `${count} risposte`,
    live: "Aperta",
    closed: "Chiusa",
    copyStudentLink: "Copia il link per gli studenti",
    copied: "Copiato!",
    openResults: "Apri i risultati",
    closeRound: "Chiudi la rilevazione",
    reopenRound: "Riapri la rilevazione",
    errorTitleClass: "Inserisci un titolo e un nome della classe.",
    errorExpected: "I partecipanti previsti devono essere un numero intero positivo.",
    errorThresholdRange: "La soglia di anonimato deve essere compresa tra 10 e 1000.",
    errorThresholdExceedsExpected:
      "La soglia di anonimato non può superare i partecipanti previsti.",
    errorLanguage: "Scegli una lingua supportata.",
    errorCreateFailed: "Non è stato possibile creare la campagna. Riprova.",
  },
  roundResults: {
    unavailableTitle: "Risultati non disponibili",
    unavailableBody:
      "Non è stato possibile trovare questa rilevazione, oppure non appartiene al tuo account.",
    backToCampaigns: "Torna alla dashboard",
    refreshResults: "Aggiorna i risultati",
    refreshing: "Aggiornamento…",
    closeRound: "Chiudi la rilevazione",
    reopenRound: "Riapri la rilevazione",
  },
  teacherDashboard: {
    demoBadge: "Dati dimostrativi · Esempio di classe sintetica",
    live: "Aperta",
    closed: "Chiusa",
    draft: "Bozza",
    responses: "Risposte",
    participation: "Partecipazione",
    anonymityThreshold: "Soglia di anonimato",
    lastUpdated: "Ultimo aggiornamento",
    thresholdResponsesUnit: (threshold) => `${threshold} risposte`,
    thresholdNoticeTitle: "I risultati non sono ancora disponibili",
    thresholdNoticeBody: (threshold, count) =>
      `Per proteggere l’anonimato degli studenti, i risultati collettivi vengono mostrati solo dopo aver ricevuto almeno ${threshold} risposte. Questa classe ha attualmente ${count} ${count === 1 ? "risposta" : "risposte"}.`,
    thresholdRemaining: (remaining) =>
      `${
        remaining === 1
          ? "Serve ancora 1 risposta prima che i risultati possano essere mostrati."
          : `Servono ancora ${remaining} risposte prima che i risultati possano essere mostrati.`
      } Fino ad allora non sono disponibili medie di sezione, distribuzioni, interpretazioni o la Ruota dell’ambiente della classe.`,
    sectionOverview: "Panoramica delle sezioni",
    overall: "Totale",
    selectedSectionStatus: (name, percent, label) =>
      `Sezione selezionata: ${name}, ${percent} per cento, ${label}.`,
    collectiveInterpretation: "Interpretazione collettiva",
    suggestedActions: "Azioni suggerite",
    sectionPercentage: "Percentuale della sezione",
    rawAverage: "Media grezza (0–4)",
    validResponses: "Risposte valide",
    distributionCaption: "Distribuzione delle risposte per categoria",
    colAnswer: "Risposta",
    colResponses: "Risposte",
    colPercentage: "Percentuale",
    percentWord: "per cento",
    responseDistribution: "Distribuzione delle risposte",
    fromCentreOutward: "Dal centro verso l’esterno",
    innermost: "più interno",
    outermost: "più esterno",
    selectSection: "Seleziona la sezione.",
    wheelAriaLabel:
      "Ruota dell’ambiente della classe. Sei sezioni uguali; ciascuna mostra la distribuzione delle risposte da Mai al centro a Sempre sul bordo esterno. Seleziona una sezione per vedere i dettagli.",
    reassessDefault:
      "Avvia una nuova rilevazione quando vuoi riesaminare questa classe.",
    exampleNextCheckIn: "Esempio di prossima rilevazione: tra sei settimane",
  },
  student: {
    welcomeHeading: "Benvenuto!",
    welcomeIntro:
      "La tua voce ci aiuta a rendere la scuola un posto migliore per tutti.",
    reassurances: [
      "Non ci sono risposte giuste o sbagliate",
      "Non ti chiediamo il nome",
      "Le tue risposte vengono unite a quelle della tua classe",
      "L’insegnante non può vedere le tue risposte individuali",
      "Circa 2 minuti",
    ],
    startButton: "Inizia",
    progress: (current, total) => `Domanda ${current} di ${total}`,
    answerGroupLabel: "Scegli una risposta",
    back: "Indietro",
    next: "Avanti",
    submit: "Invia le risposte",
    sending: "Invio in corso…",
    completionHeading: "Grazie!",
    completionMessage: "La tua risposta è stata registrata in forma anonima.",
    completionCollective:
      "Insieme possiamo creare una scuola migliore per tutti gli studenti.",
    completionSupport:
      "Se qualcosa a scuola ti fa sentire in pericolo, parla con un adulto di fiducia o usa il canale di supporto ufficiale della tua scuola.",
    homeLink: "Torna alla pagina iniziale",
    submitError:
      "Non è stato possibile inviare le tue risposte. Controlla la connessione e riprova.",
    unavailableTitle: "Questo questionario non è disponibile",
    unavailableBody:
      "Il link potrebbe essere incompleto, oppure questa rilevazione non è più aperta. Controlla il link che ti ha dato l’insegnante.",
  },
};

const DICTIONARIES: Record<Locale, Messages> = { en, it };

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}
