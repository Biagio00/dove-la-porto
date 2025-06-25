export const trashTypesStr: string[] = ["completa", "solo-vetro", "discarica"]

export const roleNameFromNum = (role: number): string => {
    switch (role) {
        case 0:
            return "utente";
        case 2:
            return "operatore";
        case 5:
            return "amministratore";
        default:
            return "ruolo non valido"
    }
}

