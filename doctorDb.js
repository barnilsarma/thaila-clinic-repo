const db = [
    {
        id: 0,
        name: "Dr. Priya Sharma",
        designation: "Senior Consultant",
        academics: "MBBS, MD (OB-GYN), FRCOG",
        yoe: "15+ Years",
        patients: "5000+ Patients",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop",
        about: `Experienced senior consultant in obstetrics and gynaecology providing comprehensive women's health care.`,
        area: ["Gynaecology", "Obstetrics"],
        areaDetails:[
            "Vaginal Birth after C-Section (VBAC)",
            "High Risk Pregnancies",
            "Gynaecologic Endoscopic Surgery",
            "Laparoscopic Myomectomy",
            "Total Laparoscopic Hysterectomy",
            "Endometriosis-Laparoscopic Surgery",
            "LNG–IUS Insertion",
            "Gynaecologic Oncology",
            "Hysteroscopic Polypectomy",
            "Hysteroscopic Septal Resection",
            "Hysteroscopic Fibroid Removal",
            "Tubal Recanalisation Surgery",
            "PCOS Management",
            "Fertility Treatment",
            "Menopause Management"
        ]
    },
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        designation: "Lead Surgeon",
        academics: "MBBS, MS (General Surgery)",
        yoe: "12+ Years",
        patients: "3000+ Surgeries",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop",
        about: `Experienced general surgeon with expertise in laparoscopy and minimally invasive procedures.`,
        area: ["General Surgery", "Laparoscopy"],
        areaDetails: [
            "Appendectomy, hernia repair and emergency general surgery",
            "Minimally invasive cholecystectomy and biliary procedures",
            "Laparoscopic colorectal and abdominal wall surgery",
            "Perioperative critical care and surgical oncology support"
        ]
    },
    {
        id: 2,
        name: "Dr. Meera Reddy",
        designation: "Pediatric Specialist",
        academics: "MBBS, MD (Pediatrics), FIAP",
        yoe: "10+ Years",
        patients: "8000+ Children",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop",
        about: `Pediatric specialist focused on child and neonatal care, preventive pediatrics and growth monitoring.`,
        area: ["Pediatrics", "Neonatology"],
        areaDetails: [
            "Well-child clinics, immunizations and developmental screening",
            "Neonatal resuscitation, NICU care and preterm follow-up",
            "Management of common pediatric infections and chronic conditions",
            "Growth, nutrition and behavioral guidance for children"
        ]
    },
    {
        id: 3,
        name: "Dr. Arun Krishnan",
        designation: "Diabetologist",
        academics: "MBBS, MD (Medicine), DM (Endo)",
        yoe: "14+ Years",
        patients: "6000+ Patients",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop",
        about: `Specialist in diabetes and endocrine disorders with experience in long-term metabolic care.`,
        area: ["Diabetology", "Endocrinology"],
        areaDetails: [
            "Comprehensive diabetes care including insulin optimisation",
            "Continuous glucose monitoring (CGM) and education",
            "Thyroid, adrenal and pituitary disorder management",
            "Metabolic syndrome, lipid disorders and weight management"
        ]
    },
    {
        id: 4,
        name: "Dr. Lakshmi Devi",
        designation: "Dermatologist",
        academics: "MBBS, MD (Dermatology), DDV",
        yoe: "8+ Years",
        patients: "4000+ Treatments",
        photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=500&fit=crop",
        about: `Dermatology and cosmetology specialist offering medical and cosmetic skin treatments.`,
        area: ["Dermatology", "Cosmetology"],
        areaDetails: [
            "Medical dermatology: acne, eczema, psoriasis and fungal infections",
            "Skin cancer checks, biopsies and mole surveillance",
            "Cosmetic procedures: chemical peels, lasers and skin rejuvenation",
            "Minimally invasive cosmetic treatments: fillers and neurotoxins"
        ]
    },
    {
        id: 5,
        name: "Dr. Venkat Ramanan",
        designation: "Orthopedic Surgeon",
        academics: "MBBS, MS (Ortho), FRCS",
        yoe: "11+ Years",
        patients: "2500+ Surgeries",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop",
        about: `Orthopedic surgeon with expertise in sports medicine and joint care.`,
        area: ["Orthopedics", "Sports Medicine"],
        areaDetails: [
            "Arthroscopic surgery for shoulder, knee and hip injuries",
            "ACL, meniscal repair and sports injury rehabilitation",
            "Joint replacement surgery and postoperative care",
            "Fracture management, casting and guided physiotherapy"
        ]
    }
];

if (typeof window !== 'undefined') window.db = db;
if (typeof module !== 'undefined' && module.exports) module.exports = db;