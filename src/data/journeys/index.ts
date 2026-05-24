export * from './types';
export * from './python';
export * from './javascript';
export * from './java';
export * from './cpp';
export * from './c';
export * from './csharp';
export * from './lua';
export * from './php';
export * from './go';
export * from './dart';
export * from './rust';
export * from './r';
export * from './ruby';
export * from './swift';

import { pythonJourney } from './python';
import { javascriptJourney } from './javascript';
import { javaJourney } from './java';
import { cppJourney } from './cpp';
import { cJourney } from './c';
import { csharpJourney } from './csharp';
import { luaJourney } from './lua';
import { phpJourney } from './php';
import { goJourney } from './go';
import { dartJourney } from './dart';
import { rustJourney } from './rust';
import { rJourney } from './r';
import { rubyJourney } from './ruby';
import { swiftJourney } from './swift';

export const allJourneys: Record<string, any> = {
    'python': pythonJourney,
    'javascript': javascriptJourney,
    'java': javaJourney,
    'cpp': cppJourney,
    'c': cJourney,
    'csharp': csharpJourney,
    'lua': luaJourney,
    'php': phpJourney,
    'go': goJourney,
    'dart': dartJourney,
    'rust': rustJourney,
    'r': rJourney,
    'ruby': rubyJourney,
    'swift': swiftJourney,
};