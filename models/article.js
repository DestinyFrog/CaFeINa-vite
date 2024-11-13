
class Article {
    constructor(title, content) {
        this.title = title
        this.content = content
    }

    get html() {
        const parsed = marked.parse(this.content)
        parsed.replace(">>", "<a ")
        return parsed
    }
}

export default Article