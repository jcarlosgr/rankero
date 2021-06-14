let list = []

const moveTop = (index) => {
    if (validIndex(index)) {
        list.unshift(list.splice(index, 1)[0]);
    } else {
        console.log('Error: Invalid index')
    }
}

const moveUp = (index) => {
    if (validIndex(index) && index > 0) {
        list.splice(index - 1, 0, (list.splice(index, 1)[0]));
    } else {
        console.log('Error: Invalid index')
    }
}

const moveDown = (index) => {
    if (validIndex(index)) {
        list.splice(index + 1, 0, (list.splice(index, 1)[0]));
    } else {
        console.log('Error: Invalid index')
    }
}

const moveBottom = (index) => {
    if (validIndex(index)) {
        list.push(list.splice(index, 1)[0]);
    } else {
        console.log('Error: Invalid index')
    }
}

const validIndex = (index) => {
    return index < list.length && index >= 0
}

const renderView = (viewList, viewType) => {
    const headerSubtitle = document.querySelector('.header__subtitle')
    const listDiv = document.querySelector('#list')
    const galleryDiv = document.createElement('div')
    const resetOption = document.createElement('p')
    const rankingOption = document.createElement('p')
    const galleryOption = document.createElement('p')

    headerSubtitle.textContent = 'rankero | ranking tool'
    listDiv.innerHTML = ''

    resetOption.classList.add('menu')
    rankingOption.classList.add('menu')
    galleryOption.classList.add('menu')

    resetOption.textContent = 'Reset list'
    rankingOption.textContent = 'Ranking view'
    galleryOption.textContent = 'Gallery view'

    resetOption.addEventListener('click', () => {
        fetchData()
    })
    rankingOption.addEventListener('click', () => {
        renderView(list, 'list')
    })
    galleryOption.addEventListener('click', () => {
        renderView(list, 'gallery')
    })

    listDiv.appendChild(resetOption)
    listDiv.appendChild(rankingOption)
    listDiv.appendChild(galleryOption)

    if (viewList.length > 0) {
        if (viewType === 'gallery') {
            galleryDiv.classList.add('gallery-container')
            listDiv.appendChild(galleryDiv)
            viewList.forEach((element, index) => {
                galleryDiv.appendChild(generateGalleryElementDOM(element, index))
            })
        } else {
            viewList.forEach((element, index) => {
                listDiv.appendChild(generateListElementDOM(element, index))
            })
        }
        
    } else {
        const noElementsMessage = document.createElement('p')
        noElementsMessage.textContent = 'There are no items to list'
        noElementsMessage.classList.add('empty-message')
        listDiv.appendChild(noElementsMessage)
    }
 }

const generateListElementDOM = (element, index) => {
    const listElementDiv = document.createElement('div')
    const infoContainer = document.createElement('div')
    const infoBlock = document.createElement('p')
    const image = document.createElement('img')
    const titleLabel = document.createElement('span')
    const textLabel = document.createElement('span')
    const tagLabel = document.createElement('span')
    const buttonsContainer = document.createElement('div')
    const topButton = document.createElement('button')
    const upButton = document.createElement('button')
    const downButton = document.createElement('button')
    const bottomButton = document.createElement('button')
    const indexNumber = document.createElement('p')

    listElementDiv.classList.add('list-item')
    infoContainer.classList.add('list-item__container')
    buttonsContainer.classList.add('list-item__container')
    image.classList.add('id', 'image-preview')
    titleLabel.classList.add('title')
    textLabel.classList.add('text')
    tagLabel.classList.add('tag')
    topButton.classList.add('button', 'button--text')
    upButton.classList.add('button', 'button--text')
    downButton.classList.add('button', 'button--text')
    bottomButton.classList.add('button', 'button--text')
    indexNumber.classList.add('index-number')

    image.src = element.image
    titleLabel.textContent = element.title
    textLabel.textContent = element.text
    tagLabel.textContent = element.tag
    topButton.textContent = 'top'
    upButton.textContent = '▲'
    downButton.textContent = '▼'
    bottomButton.textContent = 'bottom'
    indexNumber.textContent = index + 1

    topButton.addEventListener('click', () => {
        moveTop(index)
        saveData(list)
        renderView(list, 'list')
    })
    upButton.addEventListener('click', () => {
        moveUp(index)
        saveData(list)
        renderView(list, 'list')
    })
    downButton.addEventListener('click', () => {
        moveDown(index)
        saveData(list)
        renderView(list, 'list')
    })
    bottomButton.addEventListener('click', () => {
        moveBottom(index)
        saveData(list)
        renderView(list, 'list')
    })

    infoContainer.appendChild(image)
    infoBlock.appendChild(titleLabel)
    infoBlock.appendChild(textLabel)
    infoBlock.appendChild(tagLabel)
    infoContainer.appendChild(infoBlock)
    buttonsContainer.appendChild(topButton)
    buttonsContainer.appendChild(upButton)
    buttonsContainer.appendChild(downButton)
    buttonsContainer.appendChild(bottomButton)
    buttonsContainer.appendChild(indexNumber)
    listElementDiv.appendChild(infoContainer)
    listElementDiv.appendChild(buttonsContainer)

    return listElementDiv
}

const generateGalleryElementDOM = (element, index) => {
    const galleryElementDiv = document.createElement('div')
    const indexNumber = document.createElement('p')
    const image = document.createElement('img')
    const titleBlock = document.createElement('p')
    const titleLabel = document.createElement('span')
    const textLabel = document.createElement('span')
    const tagLabel = document.createElement('span')
    
    galleryElementDiv.classList.add('gallery-item-container')
    indexNumber.classList.add('gallery-index-number')
    image.classList.add('id', 'gallery-image-preview')
    titleLabel.classList.add('gallery-title')
    textLabel.classList.add('gallery-text')
    tagLabel.classList.add('gallery-tag')

    indexNumber.textContent = index + 1
    image.src = element.image
    titleLabel.textContent = element.title
    textLabel.textContent = element.text
    tagLabel.textContent = element.tag

    galleryElementDiv.appendChild(indexNumber)
    galleryElementDiv.appendChild(image)
    titleBlock.appendChild(titleLabel)
    titleBlock.appendChild(textLabel)
    titleBlock.appendChild(tagLabel)
    galleryElementDiv.appendChild(titleBlock)

    return galleryElementDiv
}

const fetchData = async () => {
    const request = new Request('input/list.json');
    const response = await fetch(request)
    const data = await response.json()
    list = await data
    saveData(list)
    renderView(list, 'list')
}

const getSavedData = () => {
    const listJSON = localStorage.getItem('list')
    try {
        return listJSON ? JSON.parse(listJSON) : []
    } catch (e) {
        return []
    }
}

const saveData = (list) => {
    localStorage.setItem('list', JSON.stringify(list))
}

list = getSavedData()
if (list.length === 0) {
    fetchData()
} else {
    renderView(list, 'list')
}