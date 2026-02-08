export type InternalProperty = {
    fullAddress: string;
    lotPlan?: { 
        lot?: string; 
        plan?: string 
    };
    volumeFolio: { 
        volume: string | null; 
        folio: string | null 
    };
    status: "KnownVolFol" | "UnknownVolFol";
    sourceTrace: { 
        provider?: string; 
        requestId?: string; 
        receivedAt?: string 
    };
};