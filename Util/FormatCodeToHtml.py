code = \
'''\
String alphabet = "qwertyuiopasdfghjklzxcvbnm";
StringBuilder stringBuilder = Arrays.stream((alphabet.split(""))).sorted()
    .collect(() -> new StringBuilder(), 
            (sb,s) -> sb.append(s), 
            (sb1, sb2) -> sb1.append(sb2.toString()));
System.out.println(stringBuilder.toString());
'''

code = code.replace('&','&amp;')
code = code.replace('<','&lt;')
code = code.replace('>','&gt;')

result = "<ul class='ccode'>\n<li><pre>"
for i in code:
    if i == '\n':
        result = result + '</pre></li>\n<li><pre>'
    else:
        result = result + i
result = result[0:-10] + '</ul>'
print(result)