export type Language = 'EN' | 'ES';

export interface TranslationContent {
  envelope: {
    clickToOpen: string;
    tapPrompt: string;
  };
  hero: {
    blessingLine1: string;
    blessingLine2: string;
    bride: string;
    brideParentsLabel: string;
    brideParents: string;
    ampersand: string;
    groom: string;
    groomParentsLabel: string;
    groomParents: string;
    invitationLine1: string;
    invitationLine2: string;
    date: string;
  };
  welcome: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    timeLocationTitle: string;
    venueLine: string;
    time: string;
    googleMapsButton: string;
  };
  countdown: {
    title: string;
    subtitlePrefix: string;
    targetDate: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    dayIsHere: string;
  };
  rsvp: {
    title: string;
    deadline: string;
    attendingQuestion: string;
    yesOption: string;
    noOption: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    dietaryLabel: string;
    dietaryPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successHeading: string;
    successMessage: string;
    errorMessage: string;
    validationName: string;
    validationEmail: string;
    validationAttendance: string;
    sendAnother: string;
  };
  final: {
    names: string;
    date: string;
    keepsakeNote: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  EN: {
    envelope: {
      clickToOpen: "PRESS SEAL TO OPEN",
      tapPrompt: "Tap the seal to reveal the invitation",
    },
    hero: {
      blessingLine1: "With God's grace and the blessings",
      blessingLine2: "of our families,",
      bride: "Irene",
      brideParentsLabel: "Daughter of",
      brideParents: "Mr. Mariadurai & Mrs. Manimatha Mariadurai",
      ampersand: "&",
      groom: "Franklin",
      groomParentsLabel: "Son of",
      groomParents: "Late Mr. Rajan & Mrs. Rejina Rajan",
      invitationLine1: "joyfully invite you to celebrate",
      invitationLine2: "the beginning of their journey together.",
      date: "16 NOVEMBER 2026",
    },
    welcome: {
      titleLine1: "Join Us To Celebrate",
      titleLine2: "Our Wedding",
      description: "We are so excited to celebrate this special day with you.",
      timeLocationTitle: "Time & Location",
      venueLine: "Château de la Couronne, Nouvelle-Aquitaine, France",
      time: "7:00 PM",
      googleMapsButton: "OPEN IN GOOGLE MAPS",
    },
    countdown: {
      title: "Countdown",
      subtitlePrefix: "Until",
      targetDate: "16 November 2026",
      days: "DAYS",
      hours: "HOURS",
      minutes: "MINUTES",
      seconds: "SECONDS",
      dayIsHere: "THE DAY IS HERE",
    },
    rsvp: {
      title: "RSVP",
      deadline: "Please respond by 28 August 2026",
      attendingQuestion: "Will you attend?",
      yesOption: "Yes, I'll be there",
      noOption: "Sorry, I can't make it",
      nameLabel: "Full name",
      namePlaceholder: "Your full name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      dietaryLabel: "Allergies or dietary requirements",
      dietaryPlaceholder: "e.g. vegetarian, gluten-free, nut allergy",
      messageLabel: "A message for the couple",
      messagePlaceholder: "Share a wish, a memory, or a note...",
      submitButton: "SEND RSVP",
      submittingButton: "SENDING...",
      successHeading: "Thank you for celebrating with us.",
      successMessage: "We can't wait to see you!",
      errorMessage: "Something went wrong. Please try again.",
      validationName: "Please enter your full name.",
      validationEmail: "Please provide a valid email address.",
      validationAttendance: "Please indicate whether you will attend.",
      sendAnother: "Submit another response",
    },
    final: {
      names: "Irene & Franklin",
      date: "NOVEMBER 16, 2026",
      keepsakeNote: "With our love and gratitude",
    },
  },
  ES: {
    envelope: {
      clickToOpen: "PRESIONA EL SELLO PARA ABRIR",
      tapPrompt: "Toca el sello para descubrir la invitación",
    },
    hero: {
      blessingLine1: "Con la gracia de Dios y las bendiciones",
      blessingLine2: "de nuestras familias,",
      bride: "Irene",
      brideParentsLabel: "Hija de",
      brideParents: "Sr. Mariadurai y Sra. Manimatha Mariadurai",
      ampersand: "&",
      groom: "Franklin",
      groomParentsLabel: "Hijo de",
      groomParents: "Difunto Sr. Rajan y Sra. Rejina Rajan",
      invitationLine1: "les invitan con alegría a celebrar",
      invitationLine2: "el comienzo de su camino juntos.",
      date: "16 DE NOVIEMBRE DE 2026",
    },
    welcome: {
      titleLine1: "Únete a Nosotros Para Celebrar",
      titleLine2: "Nuestra Boda",
      description: "Estamos muy emocionados de celebrar este día tan especial con ustedes.",
      timeLocationTitle: "Hora y Lugar",
      venueLine: "Château de la Couronne, Nouvelle-Aquitaine, Francia",
      time: "7:00 PM",
      googleMapsButton: "ABRIR EN GOOGLE MAPS",
    },
    countdown: {
      title: "Cuenta Regresiva",
      subtitlePrefix: "Hasta el",
      targetDate: "16 de Noviembre de 2026",
      days: "DÍAS",
      hours: "HORAS",
      minutes: "MINUTOS",
      seconds: "SEGUNDOS",
      dayIsHere: "¡EL GRAN DÍA HA LLEGADO!",
    },
    rsvp: {
      title: "RSVP",
      deadline: "Por favor confirmar antes del 28 de Agosto de 2026",
      attendingQuestion: "¿Asistirás?",
      yesOption: "Sí, allí estaré",
      noOption: "Lo siento, no podré asistir",
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre completo",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      dietaryLabel: "Alergias o preferencias dietéticas",
      dietaryPlaceholder: "ej. vegetariano, sin gluten, alergia a nueces",
      messageLabel: "Un mensaje para los novios",
      messagePlaceholder: "Comparte un deseo, un recuerdo o una dedicatoria...",
      submitButton: "ENVIAR RSVP",
      submittingButton: "ENVIANDO...",
      successHeading: "Gracias por celebrar con nosotros.",
      successMessage: "¡Estamos deseando verte!",
      errorMessage: "Algo salió mal. Por favor intenta de nuevo.",
      validationName: "Por favor ingresa tu nombre completo.",
      validationEmail: "Por favor ingresa un correo electrónico válido.",
      validationAttendance: "Por favor indica si podrás asistir.",
      sendAnother: "Enviar otra respuesta",
    },
    final: {
      names: "Irene & Franklin",
      date: "16 DE NOVIEMBRE DE 2026",
      keepsakeNote: "Con todo nuestro amor y gratitud",
    },
  },
};
