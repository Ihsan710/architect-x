export type ProjectScale = 'small' | 'medium' | 'large';

export interface ArchitectureInput {
    projectName: string;
    scale: ProjectScale;
    description: string;
}

export interface ArchitectureOutput {
    projectName: string;
    architectureStyle: 'Modular Monolith' | 'Microservices';
    services: string[];
    database: string;
    cache: string;
    scalingStrategy: string;
    monthlyCostEstimate: number;
    costBreakdown: {
        compute: number;
        database: number;
        network: number;
    };
    riskLevel: 'Low' | 'Medium' | 'High';
    mermaidDiagram: string;
    architectureScore: number;
}

export interface EnhancementResponse {
    changes_made: string[];
    reasoning: string[];
    updated_services: string[];
    updated_scaling_strategy: string;
    updated_infrastructure: string[];
    updated_mermaid_diagram: string;
}
