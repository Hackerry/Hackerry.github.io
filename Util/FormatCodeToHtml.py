code = '''// Method 3: Lambda Expression
        Collections.sort(nums, (a,b) -> a % 2 == 0 ? (b % 2 == 0 ? a-b: 1): (b % 2 == 0 ? -1: a-b));
        System.out.println(nums);
'''

code = code.replace('&','&amp;')
code = code.replace('<','&lt;')
code = code.replace('>','&gt;')

result = '<ul>\n<li><pre>'
for i in code:
    if i == '\n':
        result = result + '</pre></li>\n<li><pre>'
    else:
        result = result + i
result = result[0:-10] + '</ul>'
print(result)