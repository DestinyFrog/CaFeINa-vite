import App from "../features/app.js"
import "./winArticle.css"

class winArticle extends App {
    constructor(article) {
        super(`artigo: ${article.title}`)
        this.article = article
    }

    Render() {
        const main = document.createElement('main')
        main.className = "article"
        main.innerHTML = this.article.html
        super.AddToContainer(main)
    }
}

export default winArticle