import plusIcon from '../resources/svg/notecard/plus-icon.svg';

export default class ToDoItemContainer {
  constructor(noteItem, view) {
    this.noteItem = noteItem;
    this.toDoItems = noteItem.getToDoItems();
    this.noteItemView = view;
    this.uncheckedItems = [];
    this.checkedItems = [];
    this.update();
  }

  build() {
    return this._element;
  }

  _template() {
    const element = document.createElement('div');
    element.setAttribute('class', 'note-to-do-items');
    element.innerHTML = `
      <div class="to-do-item-placeholder ${
  this.toDoItems.length === 0 ? '' : 'hide'
}">
          <img class="svg-icon-large" src="${plusIcon}">
          <textarea class="to-do-item-textarea" placeholder="List item" tabindex="0"></textarea>
          </div>
          <div class="completed-items-area ${
  this.checkedItems.length > 0 ? '' : 'hide'
}">
          <div class="completed-items-separator"></div>
            <div class="completed-items-div">
              <div class="completed-items-btn rotate-90-cw"></div>
              <label class="completed-items-label">${
  this.checkedItems.length > 1
    ? `${this.checkedItems.length} Completed items`
    : '1 Completed item'
}</label>
            </div>
              <div class="completed-items-list"></div>
        </div>
        `;
    this.uncheckedItems.forEach((item) => element.insertBefore(
      ToDoItemContainer.createToDoItem(this.noteItem.id, item, this.noteItemView),
      element.querySelector('.to-do-item-placeholder'),
    ));
    this.checkedItems.forEach((item) => element
      .querySelector('.completed-items-list')
      .append(ToDoItemContainer.createToDoItem(this.noteItem.id, item, this.noteItemView)));
    element
      .querySelector('.to-do-item-placeholder .to-do-item-textarea')
      .addEventListener('keydown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.noteItemView.createNewToDoItem(this.noteItem.id, event);
      });
    element
      .querySelector('.to-do-item-placeholder .to-do-item-textarea')
      .addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    element
      .querySelector('.completed-items-div')
      .addEventListener('click', (event) => {
        event.stopPropagation();
        this.noteItemView.toggleCompletedItemsList();
      });
    return element;
  }

  update() {
    this.uncheckedItems = [];
    this.checkedItems = [];
    this.toDoItems.forEach((item) => {
      if (!item.isChecked) this.uncheckedItems.push(item);
      else this.checkedItems.push(item);
    });
    this._element = this._template();
  }

  static createToDoItem(noteId, toDoItem, view) {
    const element = document.createElement('div');
    element.setAttribute('class', 'to-do-item');
    element.setAttribute('data-item-id', toDoItem.id);
    element.innerHTML = `
        <div class="to-do-item-checkbox" checked="${toDoItem.isChecked}"></div>
        <label class="to-do-item-label">${toDoItem.label}</label>
        <textarea class="to-do-item-textarea hide" placeholder="List item">${toDoItem.label}</textarea>
        <div class="to-do-item-delete"></div>
      `;
    element
      .querySelector('.to-do-item-checkbox')
      .addEventListener('click', (event) => {
        event.stopPropagation();
        view.toggleChecked(noteId, toDoItem.id);
      });
    element
      .querySelector('.to-do-item-label')
      .addEventListener('click', (event) => {
        event.stopPropagation();
        view.changeToDoItemLabel(noteId, toDoItem.id);
      });
    element
      .querySelector('.to-do-item-delete')
      .addEventListener('click', (event) => {
        event.stopPropagation();
        view.deleteToDoItem(noteId, toDoItem.id);
      });
    return element;
  }
}
