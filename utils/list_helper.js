const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const theSumOfLikes = blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
    return theSumOfLikes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const mostLikedBlog = blogs.reduce((prev, current) => (current.likes > prev.likes ? current : prev), blogs[0])
    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}   

module.exports = {
    dummy, totalLikes, favoriteBlog
}