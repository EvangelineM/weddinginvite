export type Language = "EN" | "TA";

export interface TranslationContent {
    envelope: {
        clickToOpen: string;
        tapPrompt: string;
    };
    hero: {
        bride: string;
        ampersand: string;
        groom: string;
        date: string;
        month: string;
        verseLine1: string;
        verseRef: string;
    };
    section3: {
        inviteLine1: string;
        inviteLine2: string;
        inviteLine3: string;
        groom: string;
        ampersand: string;
        bride: string;
        verseLine1: string;
        verseLine2: string;
        verseRef: string;
        weekday: string;
        month: string;
        day: string;
        year: string;
        time: string;
    };
    venue: {
        title: string;
        subtitle: string;
        churchName: string;
        location: string;
        weddingLabel: string;
        weddingTime: string;
        receptionLabel: string;
        receptionTime: string;
        openInMaps: string;
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
        date: string;
        weekday: string;
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
        dayIsHere: string;
        closing: string;
    };
    rsvp: {
        title: string;
        attendingQuestion: string;
        yesOption: string;
        noOption: string;
        nameLabel: string;
        namePlaceholder: string;
        guestsLabel: string;
        guestsPlaceholder?: string;
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
        declinedHeading?: string;
        declinedMessage?: string;
        declinedLine1?: string;
        declinedLine2?: string;
        declinedLine3?: string;
        errorMessage: string;
        validationName: string;
        validationEmail: string;
        validationAttendance: string;
        validationGuests?: string;
        sendAnother: string;
    };
    final: {
        names: string;
        date: string;
        keepsakeNote: string;
    };
    footer: {
        namesAndLocation: string;
        guestlistPortal: string;
    };
}

export const translations: Record<Language, TranslationContent> = {
    EN: {
        envelope: {
            clickToOpen: "PRESS SEAL TO OPEN",
            tapPrompt: "Tap the seal to reveal the invitation",
        },
        hero: {
            bride: "Irene",
            ampersand: "&",
            groom: "Franklin",
            date: "16 NOVEMBER 2026",
            month: "NOVEMBER",
            verseLine1: "May your fountain be blessed",
            verseRef: "— Proverbs 5:18 (NIV)",
        },
        section3: {
            inviteLine1: "TOGETHER WITH OUR FAMILIES",
            inviteLine2: "WE JOYFULLY INVITE YOU TO",
            inviteLine3: "CELEBRATE THE WEDDING OF",
            groom: "Franklin",
            ampersand: "&",
            bride: "Irene",
            verseLine1: "“THEREFORE WHAT GOD HAS JOINED TOGETHER,",
            verseLine2: "LET NO ONE SEPARATE.”",
            verseRef: "MARK 10:9",
            weekday: "MONDAY",
            month: "NOV",
            day: "16",
            year: "2026",
            time: "AT 10:30 AM",
        },
        venue: {
            title: "Venue",
            subtitle: "WHERE WE CELEBRATE",
            churchName: "C.S.I. St. Paul's Church",
            location: "Keelkatalai, Tamil Nadu",
            weddingLabel: "WEDDING",
            weddingTime: "10:00 AM",
            receptionLabel: "RECEPTION",
            receptionTime: "1:00 PM ONWARDS",
            openInMaps: "OPEN IN MAPS",
        },
        welcome: {
            titleLine1: "Join Us To Celebrate",
            titleLine2: "Our Wedding",
            description:
                "We are so excited to celebrate this special day with you.",
            timeLocationTitle: "Time & Location",
            venueLine: "C.S.I. St. Paul's Church, Keelkatalai, Tamil Nadu",
            time: "10:00 AM",
            googleMapsButton: "OPEN IN GOOGLE MAPS",
        },
        countdown: {
            title: "Countdown",
            subtitlePrefix: "Until",
            targetDate: "16 November 2026",
            date: "NOVEMBER 16, 2026",
            weekday: "MONDAY",
            days: "DAYS",
            hours: "HOURS",
            minutes: "MINUTES",
            seconds: "SECONDS",
            dayIsHere: "THE DAY IS HERE",
            closing: "We can't wait\nto celebrate with you!",
        },
        rsvp: {
            title: "RSVP",
            attendingQuestion: "WILL YOU ATTEND?",
            yesOption: "Yes",
            noOption: "No",
            nameLabel: "FULL NAME",
            namePlaceholder: "Your full name",
            guestsLabel: "HOW MANY GUESTS?",
            guestsPlaceholder: "1",
            emailLabel: "Email",
            emailPlaceholder: "you@example.com",
            dietaryLabel: "Allergies or dietary requirements",
            dietaryPlaceholder: "e.g. vegetarian, gluten-free, nut allergy",
            messageLabel: "MESSAGE FOR THE COUPLE",
            messagePlaceholder: "Share a wish, a memory, or a note...",
            submitButton: "SEND",
            submittingButton: "SENDING...",
            successHeading: "Thank you for celebrating with us.",
            successMessage: "We can't wait to see you!",
            declinedHeading: "Thank you for letting us know.",
            declinedLine1: "Thank you for letting us know.",
            declinedLine2: "You’ll be dearly missed!",
            declinedLine3: "Sending love and blessings your way.",
            declinedMessage:
                "Thank you for letting us know. You’ll be dearly missed! Sending love and blessings your way.",
            errorMessage: "Something went wrong. Please try again.",
            validationName: "Please enter your full name.",
            validationEmail: "Please provide a valid email address.",
            validationAttendance: "Please indicate whether you will attend.",
            validationGuests: "Please enter the number of guests.",
            sendAnother: "Submit Again",
        },
        final: {
            names: "Irene & Franklin",
            date: "NOVEMBER 16, 2026",
            keepsakeNote: "With our love and gratitude",
        },
        footer: {
            namesAndLocation:
                "Irene & Franklin • C.S.I. St. Paul's Church, Keelkatalai",
            guestlistPortal: "Guestlist Portal",
        },
    },
    TA: {
        envelope: {
            clickToOpen: "முத்திரையைத் தட்டி திறக்கவும்",
            tapPrompt: "அழைப்பிதழைக் காண முத்திரையைத் தட்டவும்",
        },

        hero: {
            bride: "ஐரீன்",
            ampersand: "&",
            groom: "பிராங்க்ளின்",
            date: "16 நவம்பர் 2026",
            month: "நவம்பர்",
            verseLine1: "உன் ஊற்றுக்கண் ஆசீர்வதிக்கப்படுவதாக",
            verseRef: "— நீதிமொழிகள் 5:18",
        },
        section3: {
            inviteLine1: "எங்கள் குடும்பத்தாரின் ஆசிகளுடன்",
            inviteLine2: "எங்கள் திருமண நன்னாளைக் கொண்டாட",
            inviteLine3: "தங்களை அன்புடன் அழைக்கிறோம்",
            groom: "பிராங்க்ளின்",
            ampersand: "&",
            bride: "ஐரீன்",
            verseLine1: "“ தேவன் இணைத்ததை",
            verseLine2: "மனுஷன் பிரிக்காதிருக்கக்கடவன்.”",
            verseRef: "மாற்கு 10:9",
            weekday: "திங்கட்கிழமை",
            month: "நவம்பர்",
            day: "16",
            year: "2026",
            time: "காலை 10:00 மணி",
        },
        venue: {
            title: "திருமண இடம்",
            subtitle: "எங்கள் திருமண இடம்",
            churchName: "C.S.I. செயிண்ட் பால்ஸ் ஆலயம்",
            location: "கீழ்கட்டளை, தமிழ்நாடு",
            weddingLabel: "திருமணம்",
            weddingTime: "காலை 10:00 மணி",
            receptionLabel: "வரவேற்பு",
            receptionTime: "மதியம் 1:00 மணி",
            openInMaps: "வரைபடத்தில் காண்க",
        },
        welcome: {
            titleLine1: "எங்கள் திருமண விழாவில்",
            titleLine2: "பங்கேற்று சிறப்பிக்கவும்",
            description:
                "எங்கள் வாழ்வின் இந்த இனிய நாளை தங்களுடன் இணைந்து கொண்டாடுவதில் பேருவகை கொள்கிறோம்.",
            timeLocationTitle: "நேரம் & இடம்",
            venueLine: "C.S.I. செயிண்ட் பால்ஸ் ஆலயம், கீழ்கட்டளை, தமிழ்நாடு",
            time: "காலை 10:00 மணி",
            googleMapsButton: "GOOGLE MAPS-ல் காண்க",
        },
        countdown: {
            title: "இனிய நாளை நோக்கி…",
            subtitlePrefix: "இன்னும்",
            targetDate: "16 நவம்பர் 2026",
            date: "16 நவம்பர் 2026",
            weekday: "திங்கட்கிழமை",
            days: "நாட்கள்",
            hours: "மணிநேரங்கள்",
            minutes: "நிமிடங்கள்",
            seconds: "விநாடிகள்",
            dayIsHere: "இனிய திருமண நாள் வந்துவிட்டது",
            closing: "தங்களை அன்புடன் \n வரவேற்க ஆவலுடன் \n காத்திருக்கிறோம்!",
        },
        rsvp: {
            title: "வருகை\nஉறுதிப்படுத்தல்",
            attendingQuestion: "வருவீர்களா?",
            yesOption: "ஆம்",
            noOption: "இல்லை",
            nameLabel: "முழுப் பெயர்",
            namePlaceholder: "உங்கள் முழுப் பெயர்",
            guestsLabel: "விருந்தினர்களின் எண்ணிக்கை",
            guestsPlaceholder: "1",
            emailLabel: "மின்னஞ்சல் முகவரி",
            emailPlaceholder: "you@example.com",
            dietaryLabel: "உணவு ஒவ்வாமைகள் அல்லது சிறப்பு உணவுத் தேவைகள்",
            dietaryPlaceholder:
                "எ.கா. சைவம், குளூட்டன் இல்லாத உணவு, பருப்பு வகை ஒவ்வாமை",
            messageLabel: "மணமக்களுக்கு செய்தி",
            messagePlaceholder: "உங்கள் வாழ்த்துகளைப் பகிருங்கள்...",
            submitButton: "அனுப்பவும்",
            submittingButton: "அனுப்பப்படுகிறது...",
            successHeading:
                "உங்கள் வருகையை அன்புடன் எதிர்நோக்கிக் காத்திருக்கிறோம்!",
            successMessage: "",
            declinedHeading: "தங்களின் அன்பான",
            declinedLine1: "தங்களின் அன்பான",
            declinedLine2: "வாழ்த்துகளுடன் எங்களை",
            declinedLine3: "நினைவுகூருங்கள்.",
            declinedMessage:
                "தங்களின் அன்பான வாழ்த்துகளுடன் எங்களை நினைவுகூருங்கள்.",
            errorMessage:
                "ஏதோ ஒரு பிழை ஏற்பட்டுள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            validationName: "தங்களின் முழுப் பெயரை உள்ளிடவும்.",
            validationEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
            validationAttendance:
                "தாங்கள் கலந்துகொள்வீர்களா என்பதைத் தெரிவிக்கவும்.",
            validationGuests: "விருந்தினர்களின் எண்ணிக்கையை உள்ளிடவும்.",
            sendAnother: "மீண்டும் தெரிவிக்க",
        },
        final: {
            names: "Irene & Franklin",
            date: "16 நவம்பர் 2026",
            keepsakeNote: "எங்கள் அன்புடனும் நன்றியுடனும்",
        },
        footer: {
            namesAndLocation:
                "Irene & Franklin • C.S.I. செயிண்ட் பால்ஸ் ஆலயம், கீழ்கட்டளை",
            guestlistPortal: "விருந்தினர் பட்டியல்",
        },
    },
};
