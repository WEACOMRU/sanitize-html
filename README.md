# HTML Markup Sanitizer

A lightweight and dependency-free utility for sanitizing HTML markup according to custom rules.
Key features include:

- No external dependencies required;
- Simple yet powerful rule configuration.

## Installation

```shell
npm i html-formatting
```

## Usage

```js
import { sanitize } from 'html-formating'

sanitize(node, rules)
```

- `node`: A DOM element whose children will be formatted according to the specified rules (the container itself will not be affected);
- `rules`: An object containing the formatting rules ([Rules](#rules)).

### Configuration

#### Rules

**Type definition**: [Rules](src/models/rules.ts)

There are two types of rules: global rules for text nodes,
and a set of valid HTML elements along with corresponding rules for them

| Param             |          Type          | Description                                                        |
| :---------------- | :--------------------: | :----------------------------------------------------------------- |
| **text**          |       `TextRule`       | Global rules for text nodes                                        |
| **validElements** | `Record<string, Rule>` | Set of valid HTML elements along with corresponding rules for them |

#### TextRule

Global rules for text nodes

| Param           |            Type            | Description                                                                                                  |
| :-------------- | :------------------------: | :----------------------------------------------------------------------------------------------------------- |
| **noNBSP**      |         `boolean`          | A predefined handler that removes all non-breaking spaces from the text within the container being processed |
| **processText** | `(text: string) => string` | A method for defining a custom text handler                                                                  |

_An example_ of processing text by removing all non-breaking spaces and changing case to uppercase

```js
sanitize(node, {
  text: { noNBSP: true, processText: (text) => text.toUpperCase() }
})
// <p>Hello,[NBSP]World!</p> -> <p>HELLO, WORLD!</p>
```

#### Valid Elements

`validElements` is an object (a record) where each key is a set of valid HTML tags separated by comma,
and the value is a manipulation configuration ([Rule](#rule)) appropriate for that set.
The specified tags can be retained "as is" without any additional processing by simply assigning
an empty object `{}` as their value.
From this, it follows that any HTML tags not mentioned in any rules object key will be removed.

_For instance_, to preserve only headings and paragraphs in the final HTML markup,
the following configuration can be specified:

```js
sanitize(node, {
  validElements: { 'h1,h2,h3,h4,h5,h6,p': {} }
})
// <div><h1 class="title">Title</h1><div class="Caption"><p>Caption</p></div><p><span class="typography">Description</span></p><div>
// -> <div><h1 class="title">Title</h1><p>Caption</p><p>Description</p></div>
```

#### Rule

Configuration of additional processing of html elements

| Param               |               Type               | Description                                                                                                                                                                                                                                                                                                           |
| :------------------ | :------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **convertTo**       |             `string`             | Specifies the HTML element into which this group should be converted                                                                                                                                                                                                                                                  |
| **validAttributes** |             `string`             | A comma-separated list of allowed attributes.<br>All attributes are valid if the parameter is not specified.<br>It is possible to use a mask to allow a group of attributes, for example `data-*`                                                                                                                     |
| **validStyles**     |             `string`             | A comma-separated list of allowed inline styles.<br>All inline styles are valid if the parameter is not specified.<br>It is possible to use a mask to allow a group of styles, for example `font-*`.<br>This parameter **has no effect** if `validAttributes` is specified but does not include the `style` attribute |
| **validClasses**    |             `string`             | A comma-separated list of allowed css classes.<br>All css classes are valid if the parameter is not specified.<br>It is possible to use a mask to allow a group of classes, for example `indent-*`.<br>This parameter **has no effect** if `validAttributes` is specified but does not include the `class` attribute  |
| **noEmpty**         |            `boolean`             | Indicates whether to remove empty elements                                                                                                                                                                                                                                                                            |
| **process**         | `(element: HTMLElement) => void` | A method for defining a custom element handler                                                                                                                                                                                                                                                                        |
| **validChildren**   |      `Record<string, Rule>`      | Overriding rules for nested elements                                                                                                                                                                                                                                                                                  |

### Cases

#### Convert h1 to h2 and remove all line breaks from headings

```js
const headerRules = {
  br: {
    process: (node) => {
      const space = document.createTextNode(' ')
      node.parentNode.replaceChild(space, node)
    }
  }
}

sanitize(node, {
  validElements: {
    h1: { convertTo: 'h2', validChildren: headerRules },
    'h2,h3,h4,h5,h6': { validChildren: headerRules }
  }
})
// <div><h1>Breaking<br>News</h1></div> -> <div><h2>Breaking News</h2></div>
```

#### Add target='\_blank' to external links

```js
sanitize(node, {
  validElements: {
    a: {
      process: (link) => {
        if (!link.href.startsWith(window.location.origin)) {
          link.target = '_blank'
        }
      }
    }
  }
})
// <div><a href="https://google.com">Search</a></div> -> <div><a href="https://google.com" target="_blank">Search</a></div>
```

## License

MIT.
