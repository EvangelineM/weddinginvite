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
        blessingLine1: string;
        blessingLine2: string;
        blessingLine3: string;
        bride: string;
        brideRelation: string;
        brideParents: string;
        groom: string;
        groomRelation: string;
        groomParents: string;
        weddingTitle: string;
        weddingDate: string;
        weddingDay: string;
        weddingTime: string;
        receptionTitle: string;
        receptionDate: string;
        receptionDay: string;
        receptionTime: string;
        venueTitle: string;
        venueChurch: string;
        venueLocation: string;
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
        deadline: string;
        attendingQuestion: string;
        yesOption: string;
        noOption: string;
        nameLabel: string;
        namePlaceholder: string;
        guestsLabel: string;
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
            blessingLine1:
                "With God's grace and the blessings of our families,",
            blessingLine2: "we joyfully invite you to celebrate",
            blessingLine3: "the beginning of our journey together.",
            bride: "Irene",
            brideRelation: "Daughter of",
            brideParents: "Mr. S. Mariadurai & Mrs. Manimatha Mariadurai",
            groom: "Franklin",
            groomRelation: "Son of",
            groomParents: "late Mr. G. Rajan & Mrs. Regina Rajan",
            weddingTitle: "WEDDING",
            weddingDate: "16 NOVEMBER 2026",
            weddingDay: "MONDAY",
            weddingTime: "10:00 AM",
            receptionTitle: "RECEPTION",
            receptionDate: "16 NOVEMBER 2026",
            receptionDay: "MONDAY",
            receptionTime: "1:00 PM ONWARDS",
            venueTitle: "VENUE",
            venueChurch: "C.S.I. St. Paul's Church",
            venueLocation: "Keelkatalai, Tamil Nadu",
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
            deadline: "Kindly reply before 28 August 2026.",
            attendingQuestion: "Will you attend?",
            yesOption: "Yes",
            noOption: "No",
            nameLabel: "Full name",
            namePlaceholder: "Your full name",
            guestsLabel: "Number of guests",
            emailLabel: "Email",
            emailPlaceholder: "you@example.com",
            dietaryLabel: "Allergies or dietary requirements",
            dietaryPlaceholder: "e.g. vegetarian, gluten-free, nut allergy",
            messageLabel: "Message for the couple",
            messagePlaceholder: "Share a wish, a memory, or a note...",
            submitButton: "Send",
            submittingButton: "Sending...",
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
            blessingLine1: "இறைவனின் திருவருளாலும் குடும்பத்தாரின் ஆசிகளாலும்,",
            blessingLine2: "எங்கள் இல்லற வாழ்வின் இனிய தொடக்கத்தை",
            blessingLine3: "தங்களுடன் பகிர்ந்துகொள்ள அன்புடன் அழைக்கிறோம்.",
            bride: "ஐரீன்",
            brideRelation: "அன்பு மகள்",
            brideParents: "திரு. S. மரியதுரை & திருமதி. மணிமதா மரியதுரை",
            groom: "பிராங்க்ளின்",
            groomRelation: "அன்பு மகன்",
            groomParents: "மறைந்த திரு. G. ராஜன் & திருமதி. ரெஜினா ராஜன்",
            weddingTitle: "திருமண விழா",
            weddingDate: "16 நவம்பர் 2026",
            weddingDay: "திங்கட்கிழமை",
            weddingTime: "காலை 10:00 மணி",
            receptionTitle: "திருமண வரவேற்பு",
            receptionDate: "16 நவம்பர் 2026",
            receptionDay: "திங்கட்கிழமை",
            receptionTime: "பிற்பகல் 1:00 மணி",
            venueTitle: "திருமணம் நடைபெறும் இடம்",
            venueChurch: "சி.எஸ்.ஐ. செயிண்ட் பால்ஸ் ஆலயம்",
            venueLocation: "கீழ்க்கட்டளை, தமிழ்நாடு",
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
            title: "RSVP",
            deadline: "28 ஆகஸ்ட் 2026-க்குள் தங்களின் வருகையைத் தெரிவிக்கவும்.",
            attendingQuestion: "தாங்கள் கலந்துகொள்வீர்களா?",
            yesOption: "ஆம்",
            noOption: "இல்லை",
            nameLabel: "முழுப் பெயர்",
            namePlaceholder: "தங்களின் முழுப் பெயர்",
            guestsLabel: "விருந்தினர்களின் எண்ணிக்கை",
            emailLabel: "மின்னஞ்சல் முகவரி",
            emailPlaceholder: "you@example.com",
            dietaryLabel: "உணவு ஒவ்வாமைகள் அல்லது சிறப்பு உணவுத் தேவைகள்",
            dietaryPlaceholder:
                "எ.கா. சைவம், குளூட்டன் இல்லாத உணவு, பருப்பு வகை ஒவ்வாமை",
            messageLabel: "மணமக்களுக்கு வாழ்த்து",
            messagePlaceholder: "வாழ்த்துச் செய்தியைப் பகிருங்கள்...",
            submitButton: "அனுப்புக",
            submittingButton: "அனுப்பப்படுகிறது...",
            successHeading:
                "எங்களுடன் இணைந்து இவ்விழாவை சிறப்பித்தமைக்கு நன்றி.",
            successMessage: "தங்களை அன்புடன் வரவேற்க ஆவலுடன் காத்திருக்கிறோம்!",
            errorMessage:
                "ஏதோ ஒரு பிழை ஏற்பட்டுள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            validationName: "தங்களின் முழுப் பெயரை உள்ளிடவும்.",
            validationEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
            validationAttendance:
                "தாங்கள் கலந்துகொள்வீர்களா என்பதைத் தெரிவிக்கவும்.",
            sendAnother: "மற்றொரு பதிலைச் சமர்ப்பிக்கவும்",
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
