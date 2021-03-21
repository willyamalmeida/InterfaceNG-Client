Store = function (key) {
    if (!key) {
        throw ("key undefined");
    }

    this.key = key;
    this.init();
};

Store.prototype = {
    init: function () {
        if (!localStorage.getItem(this.key)) {
            this.saveLocalStorage([]);
        }

        this.list = this.get();
    },

    assertItem: function (item) {
        if (!item) {
            throw ("item null");
        }

        var isNew = item.id === 0;

        if(!isNew) {
            this.assertItemExist(item.id);
        }
    },

    assertItemExist: function(id) {
        var item = this.getItemById(id);

        if(!item) {
            throw("item não existe");
        }
    },

    save: function (item, callbackUpdate) {
        this.assertItem(item);

        var isNew = item.id === 0;
        var items = this.get();

        if (isNew) {
            item.id = this.getNextId(items);
            items.push(item);
        }
        else {
            var updateItem = this.getItem(items, item.id);
            callbackUpdate(updateItem);
        }

        this.saveLocalStorage(items);
    },

    saveLocalStorage: function(items) {
        var newItems = JSON.stringify(items);
        localStorage.setItem(this.key, newItems);
    },

    get: function () {
        var items = localStorage.getItem(this.key);
        var list = JSON.parse(items);

        return list;
    },

    getItemById: function (id) {
        var items = this.get();
        var item = this.getItem(items, id);

        return item;
    },

    getItem: function(items, id) {
        var item = items.find(function(x) { return x.id === Number(id); });
        return item;
    },

    getNextId: function(items) {
        var idList = items.reduce(function(ids, item) {
            ids.push(item.id);
            return ids;
        }, [0]);

        var max = idList.reduce(function(a, b) {
             return Math.max(a, b);
        });

        var nextId = max + 1;

        return nextId;
    },

    clear: function () {
        localStorage.removeItem(this.key);
    },

    removeItem: function (id) {
        this.assertItemExist(id);

        var items = this.get();
        var item = this.getItemById(id);

        items.pop(item);

        this.saveLocalStorage(items);
    }
};