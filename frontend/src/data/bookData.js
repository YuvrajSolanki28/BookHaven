export const bookData = {
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.5,
    reviewCount: 1024,
    price: 19.99,
    originalPrice: 24.99,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    ],
    availableFormats: [
      { id: "paperback", name: "Paperback", price: 19.99 },
      { id: "hardcover", name: "Hardcover", price: 24.99 },
      { id: "ebook", name: "eBook", price: 12.99 },
      { id: "audiobook", name: "Audiobook", price: 15.99 },
    ],
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?\n\nA dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.\n\nSomewhere out beyond the edge of the universe there is a library that contains an infinite number of books, each one the story of another reality. One tells the story of your life as it is, along with another book for the other life you could have lived if you had made a different choice at any point in your life. While we all wonder how our lives might have been, what if you had the chance to go to the library and see for yourself? Would any of these other lives truly be better?",
    details: {
      publisher: "Canongate Books",
      language: "English",
      paperback: "304 pages",
      isbn: "978-1786892720",
      dimensions: "5.08 x 0.87 x 7.8 inches",
    },
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "September 15, 2023",
        title: "Life-changing read!",
        comment: "This book completely changed my perspective on life and the choices we make. The concept is brilliant and execution flawless. I couldn't put it down and finished it in one sitting. Highly recommend to anyone who enjoys thought-provoking fiction."
      },
      {
        id: 2,
        name: "Michael Roberts",
        rating: 4,
        date: "August 28, 2023",
        title: "Beautiful and thought-provoking",
        comment: "Matt Haig has a way with words that just pulls you in. The concept of the midnight library is fascinating and the execution is nearly perfect. I only wish the ending had been a bit more developed, but overall a fantastic read."
      },
      {
        id: 3,
        name: "Emily Chen",
        rating: 5,
        date: "July 14, 2023",
        title: "Couldn't put it down",
        comment: "One of the best books I've read this year. The premise is unique and Haig develops it beautifully. The character's journey is emotional and relatable. I found myself reflecting on my own life choices throughout the read."
      },
      {
        id: 4,
        name: "David Williams",
        rating: 3,
        date: "June 30, 2023",
        title: "Good but overrated",
        comment: "While the concept is interesting, I found the execution a bit predictable. The writing is solid and the message is positive, but I didn't find it as life-changing as other reviewers have suggested. It's a good read, but temper your expectations."
      }
    ],
    recommendedBooks: [
      {
        id: 1,
        title: "How to Stop Time",
        author: "Matt Haig",
        cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 18.99
      },
      {
        id: 2,
        title: "The Humans",
        author: "Matt Haig",
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 16.99
      },
      {
        id: 3,
        title: "Reasons to Stay Alive",
        author: "Matt Haig",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 15.99
      },
      {
        id: 4,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 22.99
      },
      {
        id: 5,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 20.99
      },
      {
        id: 6,
        title: "The Thursday Murder Club",
        author: "Richard Osman",
        cover: "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        price: 17.99
      },
    ]
  }