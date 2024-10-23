const identityType: any = {
    es: {
        '1': 'Cédula de Ciudadanía',
        '2': 'Cédula de Extranjería',
        '4': 'Pasaporte'
    },
    en: {
        '1': 'Citizenship ID',
        '2': 'Foreigner ID',
        '4': 'Passport'
    }
};

const incidentType: any = {
    es: {
        '1': 'Petición',
        '2': 'Queja/Reclamo',
        '3': 'Sugerencia'
    },
    en: {
        '1': 'Request',
        '2': 'Complaint/Claim',
        '3': 'Suggestion'
    }
};

const incidentChannel: any = {
    es: {
        '1': 'App Movil',
        '2': 'Llamada Telefónica',
        '3': 'Correo Electrónico'
    },
    en: {
        '1': 'Phone Call',
        '2': 'Email',
        '3': 'Mobile App'
    }
};

const incidentStatus: any = {
    es: {
        '1': 'Abierto',
        '2': 'Desestimado',
        '3': 'Escalado',
        '4': 'Cerrado Satisfactoriamente',
        '5': 'Cerrado Insatisfactoriamente',
        '6': 'Reaperturado'
    },
    en: {
        "1": "Open",
        "2": "Dismissed",
        "3": "Escalated",
        "4": "Closed Satisfactorily",
        "5": "Closed Unsatisfactorily",
        "6": "Reopened"
      }
};

export {identityType, incidentType, incidentChannel, incidentStatus}


