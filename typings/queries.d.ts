declare module queries {

    export interface Config {
        id: string;
        key: string;
        value: string;
        encrypted?: boolean;
    }

    export interface Process {
        id: string;
        name: string;
        detail: string;
        type: string;
        active: boolean;
    }

    export interface Domain {
        id: string;
        name: string;
        registryCreationDate: string;
        registryExpiryDate: string;
        registryUpdatedDate: string;
        lastCheckedDate: string;
        expiresIn: string;
        lastCheckError: string;
    }

}

