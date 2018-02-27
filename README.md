# spaceless

![Babel Plugin](https://s3-us-west-2.amazonaws.com/jgardner/babel-plugin-spaceless/babel-plugin-badge.png "This package is a Babel plugin!")

A Babel plugin which strips excess whitespace from template strings at compilation time.

🛰<

## Usage

Check out this plugin in action [on AST Explorer](https://astexplorer.net/#/gist/352bbab2cb8c6ea514326f163fb59139/latest)

```javascript
spaceless`
  <body>
      <main>
          <nav>
              <ul>
                  <li>Keep    this      whitespace      ! </li>
              </ul>
          </nav>
          <p>
              Howdy!<br>
              How&rsquo;s it going?
          </p>
      </main>
  </body>
`;
```

#### Result

```html
<body><main><nav><ul><li>Keep    this      whitespace      !</li></ul></nav><p>Howdy!<br>How&rsquo;s it going?</p></main></body>
```

## Attribution

The source code is largely based on this article from WebEngage: [*Transforming our JavaScript code at build-time with Babel*](https://engineering.webengage.com/2016/07/15/babel/)

## Alternatives

There's more than one way to skin a template literal. You might also be interested in these well-tested and more popular packages:

- [babel-plugin-dedent](https://github.com/MartinKolarik/babel-plugin-dedent)
- `oneLine` from [common-tags](https://github.com/declandewet/common-tags#oneline)

### What's the difference?

The functions `oneLine`, `oneLineTrim`, `stripIndent`, and `stripIndents` from the [common-tags](https://github.com/declandewet/common-tags)
library remove excess whitespace __at runtime__. This plugin strips whitespace during compilation, so not to add any
overhead nor add another module to `import`.

[babel-plugin-dedent](https://github.com/MartinKolarik/babel-plugin-dedent) removes excess whitespace at compilation time;
however, it leaves new lines intact. The __spaceless__ plugin removes whitespace *and* new lines. It makes an extra effort
clean up whitespace between HTML tags too.

## License
MIT
