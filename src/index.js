import './styles/index.less';
import 'katex';
import renderMathInElement from 'katex/contrib/auto-render/auto-render';

renderMathInElement(document.body, {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: true},
    {left: '\\(', right: '\\)', display: true},
    {left: '\\[', right: '\\]', display: true}],
  ignoredTags: [],
});
