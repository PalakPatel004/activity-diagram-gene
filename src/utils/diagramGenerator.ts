import mermaid from 'mermaid';

interface ActivityState {
  id: string;
  name: string;
  type?: string;
}

export const generateActivityDiagram = async (prompt: string): Promise<string> => {
  // Initialize mermaid with correct configuration
  mermaid.initialize({ 
    theme: 'dark',
    themeVariables: {
      primaryColor: '#2B2B2B',
      primaryTextColor: '#fff',
      primaryBorderColor: '#fff',
      lineColor: '#fff',
      secondaryColor: '#006100',
      tertiaryColor: '#610000'
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    }
  });

  // Convert natural language to activity diagram syntax
  const diagramSyntax = convertToMermaidSyntax(prompt);
  
  try {
    const { svg } = await mermaid.render('diagram', diagramSyntax);
    return svg;
  } catch (error) {
    console.error('Error generating diagram:', error);
    console.log('Generated syntax:', diagramSyntax);
    throw error;
  }
};

const convertToMermaidSyntax = (prompt: string): string => {
  const lines = prompt.split('.');
  let mermaidSyntax = 'graph TD\n';
  const states: ActivityState[] = [];
  const connections: string[] = [];
  let lastState: ActivityState | null = null;

  // Add initial state
  states.push({ id: 'Start', name: 'Start' });
  
  lines.forEach((line, index) => {
    line = line.trim().toLowerCase();
    if (!line) return;

    // Handle conditional flows (If statements)
    if (line.includes('if')) {
      const parts = line.split('if');
      const condition = parts[1].split(',')[0].trim();
      const decisionId = `Decision${index}`;
      
      states.push({ 
        id: decisionId, 
        name: condition
      });

      if (lastState) {
        connections.push(`    ${lastState.id}((${lastState.name})) --> ${decisionId}{${condition}}`);
      } else {
        connections.push(`    Start((Start)) --> ${decisionId}{${condition}}`);
      }

      // Handle success path
      const successId = `Success${index}`;
      const successAction = parts[1].split(',')[1]?.trim() || 'Success';
      states.push({ 
        id: successId, 
        name: successAction
      });
      connections.push(`    ${decisionId}{${condition}} -->|Yes| ${successId}[${successAction}]`);

      lastState = { id: decisionId, name: condition };
    }
    // Handle alternative flows (Otherwise statements)
    else if (line.includes('otherwise')) {
      const failureId = `Failure${index}`;
      const actionText = line.split('otherwise')[1].trim();
      states.push({ 
        id: failureId, 
        name: actionText
      });

      if (lastState && lastState.id.includes('Decision')) {
        connections.push(`    ${lastState.id}{${lastState.name}} -->|No| ${failureId}[${actionText}]`);
      }

      // Add retry flow
      if (line.includes('try again')) {
        const retryId = `Retry${index}`;
        states.push({ id: retryId, name: 'Try Again' });
        connections.push(`    ${failureId}[${actionText}] --> ${retryId}[Try Again]`);
        connections.push(`    ${retryId}[Try Again] --> Start((Start))`);
      }
    }
    // Handle normal activities
    else if (line) {
      const stateId = `State${index}`;
      const stateName = line.replace(/^(user|system|they)\s*/i, '').trim();
      
      states.push({ id: stateId, name: stateName });
      
      if (lastState) {
        if (lastState.id.includes('Decision')) {
          connections.push(`    ${lastState.id}{${lastState.name}} --> ${stateId}[${stateName}]`);
        } else {
          connections.push(`    ${lastState.id}[${lastState.name}] --> ${stateId}[${stateName}]`);
        }
      } else {
        connections.push(`    Start((Start)) --> ${stateId}[${stateName}]`);
      }
      
      lastState = { id: stateId, name: stateName };
    }
  });

  // Add final state if there's an end state
  if (lastState && !lastState.id.includes('Retry')) {
    if (lastState.id.includes('Decision')) {
      connections.push(`    ${lastState.id}{${lastState.name}} --> End((End))`);
    } else {
      connections.push(`    ${lastState.id}[${lastState.name}] --> End((End))`);
    }
  }

  // Combine all parts into final syntax
  return mermaidSyntax + connections.join('\n');
};