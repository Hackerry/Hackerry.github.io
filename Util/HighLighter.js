var colors = {
    "reservedWordsColor": '#ff5722',
    "variableColor": '#03a9f4',
    "stringColor": '#ff9800',
    "commentColor": '#4caf50',
    "escapeColor": '#ffeb3b',
    "numericColor": '#009688',
}

var data = String.raw`
// DFS algorithm in C

#include <stdio.h>
#include <stdlib.h>

struct node {
  int vertex;
  struct node* next;
};

struct node* createNode(int v);

struct Graph {
  int numVertices;
  int* visited;

  // We need int** to store a two dimensional array.
  // Similary, we need struct node** to store an array of Linked lists
  struct node** adjLists;
};

// DFS algo
void DFS(struct Graph* graph, int vertex) {
  struct node* adjList = graph->adjLists[vertex];
  struct node* temp = adjList;

  graph->visited[vertex] = 1;
  printf("Visited %d \n", vertex);

  while (temp != NULL) {
    int connectedVertex = temp->vertex;

    if (graph->visited[connectedVertex] == 0) {
      DFS(graph, connectedVertex);
    }
    temp = temp->next;
  }
}

// Create a node
struct node* createNode(int v) {
  struct node* newNode = malloc(sizeof(struct node));
  newNode->vertex = v;
  newNode->next = NULL;
  return newNode;
}

// Create graph
struct Graph* createGraph(int vertices) {
  struct Graph* graph = malloc(sizeof(struct Graph));
  graph->numVertices = vertices;

  graph->adjLists = malloc(vertices * sizeof(struct node*));

  graph->visited = malloc(vertices * sizeof(int));

  int i;
  for (i = 0; i < vertices; i++) {
    graph->adjLists[i] = NULL;
    graph->visited[i] = 0;
  }
  return graph;
}

// Add edge
void addEdge(struct Graph* graph, int src, int dest) {
  // Add edge from src to dest
  struct node* newNode = createNode(dest);
  newNode->next = graph->adjLists[src];
  graph->adjLists[src] = newNode;

  // Add edge from dest to src
  newNode = createNode(src);
  newNode->next = graph->adjLists[dest];
  graph->adjLists[dest] = newNode;
}

// Print the graph
void printGraph(struct Graph* graph) {
  int v;
  for (v = 0; v < graph->numVertices; v++) {
    struct node* temp = graph->adjLists[v];
    printf("\n Adjacency list of vertex %d\n ", v);
    while (temp) {
      printf("%d -> ", temp->vertex);
      temp = temp->next;
    }
    printf("\n");
  }
}

int main() {
  struct Graph* graph = createGraph(4);
  addEdge(graph, 0, 1);
  addEdge(graph, 0, 2);
  addEdge(graph, 1, 2);
  addEdge(graph, 2, 3);

  printGraph(graph);

  DFS(graph, 2);

  return 0;
}`;

/*const KEYWORDS = {
    "JAVA": ["abstract", "continue", "for", "new", "switch", "assert", "default", "goto", "package", "synchronized", "boolean", "do", "if", "private", "this", "break", "double", "implements", "protected", "throw", "byte", "else", "import", "public", "throws", "case", "enum", "instanceof", "return", "transient", "catch", "extends", "int", "short", "try", "char", "final", "interface", "static", "void", "class", "finally", "long", "strictfp","volatile", "const", "float", "native", "super", "while"],
}*/
const KEYWORDS = [
    // Java keywords: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
    "abstract", "continue", "for", "new", "switch", "assert", "default", "goto", "package", "synchronized", "boolean", "do", "if", "private", "this", "break", "double", "implements", "protected", "throw", "byte", "else", "import", "public", "throws", "case", "enum", "instanceof", "return", "transient", "catch", "extends", "int", "short", "try", "char", "final", "interface", "static", "void", "class", "finally", "long", "strictfp","volatile", "const", "float", "native", "super", "while",
    // + GOlang keywords: https://golang.org/ref/spec#Keywords
    "func", "var", "select", "defer", "go", "map", "struct", "chan", "fallthrough", "range", "type",
    // + Javascript keywords: https://www.w3schools.com/js/js_reserved.asp
    "arguments", "await", "debugger", "delete", "eval", "export", "false", "function", "in", "let", "null", "true", "typeof", "with", "yield",
    // + C keywords: https://en.cppreference.com/w/c/keyword
    "auto", "extern", "inline", "register", "restrict", "signed", "sizeof", "typedef", "union", "unsigned",
    // + C++ keywords: https://en.cppreference.com/w/cpp/keyword
    "alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", "atomic_noexcept", "bitand", "bitor", "bool", "char8_t", "char16_t", "char32_t", "compl", "concept", "consteval", "constexpr", "constinit", "const_cast", "co_await", "co_return", "co_yield", "decltype", "dynamic_cast", "explicit", "friend", "mutable", "namespace", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "reflexpr", "reinterpret_cast", "requires", "short", "static_assert", "static_cast", "template", "thread_local", "typeid", "typename", "using", "virtual", "wchar_t", "xor", "xor_eq",
];

const REG_DELIM = ["(", ")", ";", ":", "=", "<", ">", "+", "{", "}", "[", "]", "&", "|", "^", "%", " ", "\n", ","];
const STR_DELIM = ["'", "\""];
const ESC_DELIM = ["\\"];
const COM_DELIM = ["/"];
const FUN_DELIM = ["."];
const PTR_DELIM = ["-"];

const REG_COLOR = '#000000';
const STR_COLOR = '#d8721a';
const ESC_COLOR = '#ffeb3b';
const NUM_COLOR = '#4caf50';
const COM_COLOR = '#9e9e9e';
const KEY_COLOR = '#2196f3';
const FUN_COLOR = '#ffeb3b';
const PTR_COLOR = '#DAF7A6 ';

function highlight(data) {
    var startIdx = 0;

    var result = '';

    // Print individual characters for debug
    //data.split('').forEach((e, i) => console.log(i + ": " + data.charCodeAt(i) + "-" + e + "\n"));

    var i = 0;
    var dataLength = data.length;
    while(i < dataLength) {
        if(data.charAt(i) === '/' && i+1 < dataLength) {
            //console.log("Comment starts at: " + i);

            // Test comment
            var isComment = false;
            var isMultiline = false;
            if(data.charAt(i+1) === '/') {
                isComment = true;
            } else if(data.charAt(i+1) === '*') {
                isComment = true;
                isMultiline = true;
            }

            // Loop until comment ends
            if(isComment) {
                startIdx = i;

                while(i < dataLength) {
                    i++;

                    // Comment end detection
                    if(data.charAt(i) === '\n' && !isMultiline) {
                        break;
                    } else if(data.charAt(i) === '*' && i+1 < dataLength && data.charAt(i+1) === '/' && isMultiline) {
                        i++;
                        break;
                    }
                }

                // Hightlight last part
                result += getHightLight(escapeSpecialChar(data.substring(startIdx, i+1)), COM_COLOR);
                //console.log("Comment highlighted: " + startIdx + "-" + i);
            }
            //console.log("Comment ends at: " + i);
        } else if(STR_DELIM.includes(data.charAt(i))) {
            //console.log("String starts at: " + i);

            // Test string
            var strDelim = data.charAt(i);
            startIdx = i;

            // Loop until string ends
            while(i < dataLength) {
                i++;

                // String end detection
                //console.log("Char is " + data.charAt(i) + " at: " + i);
                if(data.charAt(i) === strDelim) {
                    break;
                } else if(ESC_DELIM.includes(data.charAt(i)) && i+1 < dataLength) {
                    // Optional escape sequence
                    result += getHightLight(escapeSpecialChar(data.substring(startIdx, i)), STR_COLOR);
                    result += getHightLight(escapeSpecialChar(data.substring(i, i+2)), ESC_COLOR);
                    i++;
                    startIdx = i+1;
                }
            }

            // Hightlight last part
            result += getHightLight(escapeSpecialChar(data.substring(startIdx, i+1)), STR_COLOR);
            //console.log("String ends: " + startIdx + "-" + i);
        } else if(FUN_DELIM.includes(data.charAt(i))) {
            //console.log("Function call check starts at: " + i);

            result += escapeSpecialChar(data.charAt(i));
            i++;

            startIdx = i;

            // Only detect function name with alphanumeric chars and underscores
            while(i < dataLength && data.charAt(i).match(/[a-z0-9_]/i)) {
                i++;
            }

            // Function open bracket
            if(data.charAt(i) === '(') {
                result += getHightLight(escapeSpecialChar(data.substring(startIdx, i)), FUN_COLOR);
                result += escapeSpecialChar(data.charAt(i));
            } else {
                // Other default color
                result += escapeSpecialChar(data.substring(startIdx, i));

                // Move one character to the left in case data[i] a special deliminator
                i--;
            }

            //console.log("Function check ends: " + startIdx + "-" + i);
        } else if(PTR_DELIM.includes(data.charAt(i))) {
            //console.log("Pointer call check starts at: " + i);

            if(i+1 < dataLength && data.charAt(i+1) === '>') {
                result += escapeSpecialChar(data.substring(i, i+2));
                i += 2;

                startIdx = i;

                // Only detect pointer field with alphanumeric chars and underscores
                while(i < dataLength && data.charAt(i).match(/[a-z0-9_]/i)) {
                    i++;
                }

                result += getHightLight(escapeSpecialChar(data.substring(startIdx, i)), PTR_COLOR);
                i--;
            }

            //console.log("Pointer check ends: " + startIdx + "-" + i);
        } else {
            //console.log("Other checks start at: " + i);

            // Everything else
            startIdx = i;

            // Loop until next deliminator
            var specialDelim = false;
            while(!REG_DELIM.includes(data.charAt(i)) && i < dataLength) {
                if(STR_DELIM.includes(data.charAt(i)) || COM_DELIM.includes(data.charAt(i)) || FUN_DELIM.includes(data.charAt(i)) || PTR_DELIM.includes(data.charAt(i))) {
                    specialDelim = true;
                    break;
                }

                i++;
            }

            // Check keywords and digits, or special deliminator processed in previous cases
            var lastString = data.substring(startIdx, i);
            if(KEYWORDS.includes(lastString)) {
                // Is a keyword
                result += getHightLight(escapeSpecialChar(lastString), KEY_COLOR);
                result += escapeSpecialChar(data.charAt(i));
            } else if(lastString.split('').every((c) => c >= '0' && c <= '9')) {
                // Is a number
                result += getHightLight(escapeSpecialChar(lastString), NUM_COLOR);
                result += escapeSpecialChar(data.charAt(i));
            } else if(lastString.match(/[a-z0-9_]/i) && data.charAt(i) === '(') {
                // Is a function
                result += getHightLight(escapeSpecialChar(lastString), FUN_COLOR);
                result += escapeSpecialChar(data.charAt(i));
            }else {
                // Special deliminator in prev cases
                if(specialDelim) {
                    result += escapeSpecialChar(data.substring(startIdx, i));
                    i--;
                } else {
                    result += escapeSpecialChar(data.substring(startIdx, i+1));
                }
            }

            //console.log("Other checks end at: " + i);
        }

        startIdx = i;
        i++;
    }

    return result;
}

function getHightLight(part, color) {
    return "<span style='color:" + color + "'>" + part + "</span>";
}

function escapeSpecialChar(data) {
    data = String(data);
    data = data.replaceAll('&','&amp;');
    data = data.replaceAll('<','&lt;');
    data = data.replaceAll('>','&gt;');

    return data;
}