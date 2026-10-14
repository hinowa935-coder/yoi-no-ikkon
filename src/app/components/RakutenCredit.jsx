const credit='<!-- Rakuten Web Services Attribution Snippet FROM HERE -->\n<a href="https://developers.rakuten.com/" target="_blank">Supported by Rakuten Developers</a>\n<!-- Rakuten Web Services Attribution Snippet TO HERE -->';
export default function RakutenCredit() {
  return <div className="footer-disclosure" dangerouslySetInnerHTML={{__html:credit}} />;
}
