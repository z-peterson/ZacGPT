// registerLanguages.js
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import r from 'react-syntax-highlighter/dist/esm/languages/hljs/r';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import perl from 'react-syntax-highlighter/dist/esm/languages/hljs/perl';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import assembly from 'react-syntax-highlighter/dist/esm/languages/hljs/x86asm';
import scala from 'react-syntax-highlighter/dist/esm/languages/hljs/scala';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/hljs/objectivec';
import groovy from 'react-syntax-highlighter/dist/esm/languages/hljs/groovy';
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart';
import fsharp from 'react-syntax-highlighter/dist/esm/languages/hljs/fsharp';
import prolog from 'react-syntax-highlighter/dist/esm/languages/hljs/prolog';
import lua from 'react-syntax-highlighter/dist/esm/languages/hljs/lua';
// More languages can be imported here.

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('r', r);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('perl', perl);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('assembly', assembly);
SyntaxHighlighter.registerLanguage('scala', scala);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('objectivec', objectivec);
SyntaxHighlighter.registerLanguage('groovy', groovy);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('fsharp', fsharp);
SyntaxHighlighter.registerLanguage('prolog', prolog);
SyntaxHighlighter.registerLanguage('lua', lua);
// More languages can be registered here.
