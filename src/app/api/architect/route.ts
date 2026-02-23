import { NextResponse } from 'next/server';
import { ArchitectureInput, ArchitectureOutput } from '@/types';

export const dynamic = 'force-dynamic';

function generateArchitectureFeatures(scale: ArchitectureInput['scale'], requiresRealtime: boolean, requiresHeavyData: boolean, requiresAlerts: boolean) {
    let style: ArchitectureOutput['architectureStyle'] = 'Modular Monolith';
    let services = ['Web Server (Next.js)', 'Core API Module'];
    let database = 'PostgreSQL (Relational)';
    let cache = 'None';
    let scalingStrategy = 'Vertical scaling of primary server. Basic load balancing.';
    let cost = 0;
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    let score = 85;

    // Base monitoring added to all architectures
    const monitoringServices = ['Metrics & Logs (Prometheus/Grafana)'];

    let costBreakdown = { compute: 0, database: 0, network: 0 };

    if (scale === 'small') {
        cost = requiresHeavyData ? 80 : 35; // Server + DB
        costBreakdown = {
            compute: 20,
            database: requiresHeavyData ? 50 : 10,
            network: 5
        };
        if (requiresRealtime) {
            services.push('WebSocket Gateway');
            cost += 20;
            costBreakdown.compute += 10;
            costBreakdown.network += 10;
        }
        if (requiresAlerts) {
            services.push('Basic Alert Cronjob');
        }
    } else if (scale === 'medium') {
        style = 'Modular Monolith';
        services.push('Background Worker');
        database = 'PostgreSQL (Primary) + Read Replica';
        cache = 'Redis (Cache)';
        scalingStrategy = 'Horizontal scaling behind Load Balancer. Asynchronous task queues.';
        cost = 150 + (requiresHeavyData ? 100 : 0);
        costBreakdown = {
            compute: 80,
            database: 50 + (requiresHeavyData ? 100 : 0),
            network: 20
        };

        if (requiresRealtime) {
            services.push('Realtime Gateway (SSE/WS)');
            cache = 'Redis (Cache + Pub/Sub)'; // Upgrade redis usage
            cost += 80;
            costBreakdown.compute += 30;
            costBreakdown.network += 50;
        }
        if (requiresAlerts) {
            services.push('Alert Engine (Rule Processor)');
            services.push('Notification Dispatcher');
        }

        risk = 'Medium';
        score = 90;
    } else {
        style = 'Microservices';
        services = [
            'API Gateway',
            'Auth Service',
            'User Service',
        ];
        costBreakdown = {
            compute: 300,
            database: 300,
            network: 200
        };
        cost = costBreakdown.compute + costBreakdown.database + costBreakdown.network; // Initial cost for microservices

        if (requiresHeavyData) {
            services.push('Data Pipeline (Kafka)');
            services.push('Analytics Engine');
            cost += 400;
            costBreakdown.compute += 100;
            costBreakdown.database += 300;
        }

        if (requiresRealtime) {
            services.push('Realtime Gateway (WS)');
            cache = 'Redis Cluster (Pub/Sub + Edge Caching)';
            cost += 200;
            costBreakdown.compute += 50;
            costBreakdown.network += 150;
        } else {
            cache = 'Redis Cluster';
        }

        if (requiresAlerts) {
            services.push('Alert Engine Microservice');
            services.push('Notification Dispatcher');
        }

        database = 'PostgreSQL (Cluster) + Document DB';
        scalingStrategy = 'Kubernetes auto-scaling. Domain-driven micro-databases with event sourcing architecture.';
        risk = 'High';
        score = 95;
    }

    return {
        style,
        services: [...services, ...monitoringServices],
        database,
        cache,
        scalingStrategy,
        monthlyCostEstimate: cost, // Keep the total cost for backward compatibility if needed
        costBreakdown,
        risk,
        score
    };
}

function generateMermaidDiagram(
    scale: ArchitectureInput['scale'],
    style: ArchitectureOutput['architectureStyle'],
    services: string[],
    database: string,
    cache: string,
    requiresRealtime: boolean
) {
    let mermaid = `graph TD\n\n`;

    // Classes for styling
    mermaid += `  classDef client fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc\n`;
    mermaid += `  classDef app fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#f8fafc\n`;
    mermaid += `  classDef data fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#f8fafc\n`;
    mermaid += `  classDef obs fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#f8fafc\n`;
    mermaid += `  classDef ai fill:#1e293b,stroke:#ec4899,stroke-width:2px,color:#f8fafc\n\n`;

    // 1. Client Layer
    mermaid += `  subgraph Client_Layer ["📱 Client Layer"]\n`;
    mermaid += `    client["Client Application"]:::client\n`;
    mermaid += `  end\n\n`;

    // Parse Services
    const appServices: { id: string, name: string }[] = [];
    const aiServices: { id: string, name: string }[] = [];
    const obsServices: { id: string, name: string }[] = [];

    services.forEach((srv, i) => {
        const id = `srv${i}`;
        const nameLower = srv.toLowerCase();
        if (nameLower.includes('metrics') || nameLower.includes('log') || nameLower.includes('trace') || nameLower.includes('prometheus')) {
            obsServices.push({ id, name: srv });
        } else if (nameLower.includes('ai') || nameLower.includes('analytics') || nameLower.includes('pipeline') || nameLower.includes('kafka')) {
            aiServices.push({ id, name: srv });
        } else {
            appServices.push({ id, name: srv });
        }
    });

    // 2. Application Layer
    mermaid += `  subgraph App_Layer ["⚡ Application Layer"]\n`;
    mermaid += `    lb["Load Balancer"]:::app\n`;

    if (style === 'Modular Monolith') {
        mermaid += `    api["Core API Module"]:::app\n`;
    } else {
        mermaid += `    gw{"API Gateway"}:::app\n`;
        if (requiresRealtime) {
            mermaid += `    rtgw{"Realtime Gateway"}:::app\n`;
        }
    }

    appServices.forEach(s => {
        if (s.name !== 'Core API Module' && s.name !== 'API Gateway' && s.name !== 'Realtime Gateway (WS)' && s.name !== 'WebSocket Gateway' && s.name !== 'Realtime Gateway (SSE/WS)') {
            mermaid += `    ${s.id}["${s.name}"]:::app\n`;
        }
    });

    if (style === 'Modular Monolith' && requiresRealtime) {
        mermaid += `    ws["Realtime Gateway"]:::app\n`;
    }
    mermaid += `  end\n\n`;

    // 3. AI Layer (If Present)
    if (aiServices.length > 0) {
        mermaid += `  subgraph AI_Layer ["🧠 AI & Analytics Layer"]\n`;
        aiServices.forEach(s => {
            mermaid += `    ${s.id}["${s.name}"]:::ai\n`;
        });
        mermaid += `  end\n\n`;
    }

    // 4. Data Layer
    mermaid += `  subgraph Data_Layer ["💾 Data Layer"]\n`;
    mermaid += `    db[(" ${database} ")]:::data\n`;
    if (cache !== 'None') {
        mermaid += `    cache{"${cache}"}:::data\n`;
    }
    mermaid += `  end\n\n`;

    // 5. Observability Layer
    mermaid += `  subgraph Obs_Layer ["📊 Observability Layer"]\n`;
    obsServices.forEach(s => {
        mermaid += `    ${s.id}["${s.name}"]:::obs\n`;
    });
    mermaid += `  end\n\n`;

    // Connect them
    mermaid += `  %% Synchronous flows\n`;
    mermaid += `  client --> lb\n`;

    if (style === 'Modular Monolith') {
        mermaid += `  lb --> api\n`;
        if (requiresRealtime) {
            mermaid += `  lb --> ws\n`;
            mermaid += `  ws -.-> |Async Events| api\n`;
            if (cache !== 'None') {
                mermaid += `  ws -.-> |Pub/Sub| cache\n`;
            }
        }

        appServices.forEach(s => {
            if (s.name !== 'Core API Module' && s.name !== 'WebSocket Gateway' && s.name !== 'Realtime Gateway (SSE/WS)') {
                mermaid += `  api -.-> |Internal Call| ${s.id}\n`;
                if (!s.name.includes('Alert') && !s.name.includes('Notification')) {
                    mermaid += `  ${s.id} -.-> db\n`;
                }
            }
        });
        mermaid += `  api --> db\n`;
        if (cache !== 'None') mermaid += `  api --> cache\n`;

    } else {
        mermaid += `  lb --> gw\n`;
        if (requiresRealtime) {
            mermaid += `  lb --> rtgw\n`;
        }

        appServices.forEach(s => {
            if (s.name !== 'API Gateway' && s.name !== 'Realtime Gateway (WS)') {
                mermaid += `  gw --> ${s.id}\n`;
                if (!s.name.includes('Alert') && !s.name.includes('Notification')) {
                    mermaid += `  ${s.id} --> db\n`;
                }
                if (cache !== 'None') {
                    if (s.name.includes('Alert') || s.name.includes('Notification')) {
                        mermaid += `  cache -.-> |Pub/Sub| ${s.id}\n`;
                    } else {
                        mermaid += `  ${s.id} --> cache\n`;
                    }
                }
            }
        });

        if (requiresRealtime && cache !== 'None') {
            mermaid += `  rtgw --> cache\n`;
        }
    }

    // AI connections
    if (aiServices.length > 0) {
        mermaid += `  %% Asynchronous & Background Processing\n`;
        const entryNodes = style === 'Modular Monolith' ? ['api'] : ['gw'];
        entryNodes.forEach(gw => {
            aiServices.forEach(ai => {
                if (ai.name.includes('Pipeline') || ai.name.includes('Kafka')) {
                    mermaid += `  ${gw} -.-> |Async Streams| ${ai.id}\n`;
                }
            });
        });

        // Pipeline to analytics
        const pipeline = aiServices.find(s => s.name.includes('Pipeline') || s.name.includes('Kafka'));
        aiServices.filter(s => s !== pipeline).forEach(ai => {
            mermaid += `  ${pipeline ? pipeline.id : entryNodes[0]} -.-> |Batch Process| ${ai.id}\n`;
            mermaid += `  ${ai.id} -.-> db\n`;
        });
        if (pipeline) mermaid += `  ${pipeline.id} -.-> db\n`;
    }

    // Obs Connections
    mermaid += `  %% Monitoring & Metrics\n`;
    const obsNode = obsServices.length > 0 ? obsServices[0].id : null;
    if (obsNode) {
        mermaid += `  App_Layer -.-> |Logs & Metrics| ${obsNode}\n`;
        mermaid += `  Data_Layer -.-> |Health Checks| ${obsNode}\n`;
        if (aiServices.length > 0) {
            mermaid += `  AI_Layer -.-> |Telemetry| ${obsNode}\n`;
        }
    }

    return mermaid;
}

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const data: ArchitectureInput = JSON.parse(bodyText);

        if (!data.projectName || !data.scale || !data.description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const descLower = data.description.toLowerCase();
        const requiresRealtime = descLower.includes('realtime') || descLower.includes('chat') || descLower.includes('live') || descLower.includes('socket');
        const requiresHeavyData = descLower.includes('analytics') || descLower.includes('ai') || descLower.includes('video') || descLower.includes('big data');
        const requiresAlerts = descLower.includes('alert') || descLower.includes('threshold') || descLower.includes('notification');

        const features = generateArchitectureFeatures(data.scale, requiresRealtime, requiresHeavyData, requiresAlerts);

        const mermaidDiagram = generateMermaidDiagram(
            data.scale,
            features.style,
            features.services,
            features.database,
            features.cache,
            requiresRealtime
        );

        const output: ArchitectureOutput = {
            projectName: data.projectName,
            architectureStyle: features.style,
            services: features.services,
            database: features.database,
            cache: features.cache,
            scalingStrategy: features.scalingStrategy,
            monthlyCostEstimate: features.monthlyCostEstimate,
            costBreakdown: features.costBreakdown,
            riskLevel: features.risk,
            architectureScore: features.score,
            mermaidDiagram,
        };

        await new Promise(resolve => setTimeout(resolve, 800));
        return NextResponse.json(output);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
