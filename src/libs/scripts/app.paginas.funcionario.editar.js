app = { paginas: { funcionario: {} } };
app.paginas.funcionario.editar = function($el) {
    if (!$el) {
        throw("Element undefined");
    }

    this.$el = $el;
    this.db = new Store("funcionarios");

    this.init();
};

app.paginas.funcionario.editar.prototype = {
    init: function() {
        this.$elSave = this.$el.parentElement.querySelector("[name='save']");
        this.$elDelete = this.$el.parentElement.querySelector("[name='delete']");
        this.$elCancel = this.$el.parentElement.querySelector("[name='cancel']");

        this.$elId = this.$el.parentElement.querySelector("[name='id']");
        this.$elName = this.$el.parentElement.querySelector("[name='name']");
        this.$elDepartment = this.$el.parentElement.querySelector("[name='department']");

        this.setDepartments();

        if(location.search){
            this.dataFill();
        }

        this.initEvents();
    },

    setDepartments: function() {
        var departments = new Store("departamentos").get();
        var options = departments.reduce(function(opts, department){
            opts = opts
              .concat("<option value='")
              .concat(department.id)
              .concat("'>")
              .concat(department.description)
              .concat("</option>");
            return opts;
        }, "");

        this.$elDepartment.innerHTML = "<option value='0'></option>".concat(options);
    },

    dataFill: function() {
        var props = window.location.search.replace("?", "").split("&");
        var data = props.reduce(function(acc, x) {
            var y = x.split("=");
            acc[y[0]] = y[1];
            return acc; }, {});

        this.$elId.value = data.id;

        var isNew = Number(data.id) === 0;

        if(!isNew) {
            var item = this.db.getItemById(data.id);
            this.$elName.value = item.name;

            var elOption = this.$elDepartment.parentElement.querySelector("option[value='" + item.department.id + "']");

            if(elOption){
                elOption.selected = true;
            }
        }

        this.$elId.disabled = true;
        this.$elId.readOnly = true;
        this.$elName.focus();
        this.$elDelete.hidden = isNew;
    },

    valid: function(employee) {
        if (!employee.name) {
            var msg = "Nome obrigatório";
            alert(msg);
            throw(msg);
        }

        if (!employee.department) {
            var msg = "Departamento obrigatório";
            alert(msg);
            throw(msg);
        }
    },

    save: function() {
        var employee = {
            id: Number(this.$elId.value),
            name: this.$elName.value,
            department: {}
        };

        var idDepartment = this.$elDepartment.selectedOptions[0].value;
        var department = new Store("departamentos").getItemById(idDepartment);
        employee.department = department;

        this.valid(employee);

        this.db.save(employee, function(item) {
            item.name = employee.name;
            item.department = employee.department;
        });
    },

    delete: function() {
        this.db.removeItem(Number(this.$elId.value));
    },

    goIndex: function() {
        window.location = "index.html";
    },

    initEvents: function() {
        var _this = this;

        this.$elSave.addEventListener("click", function() {
            _this.save();
            _this.goIndex();
        });

        this.$elDelete.addEventListener("click", function() {
            _this.delete();
            _this.goIndex();
        });

        this.$elCancel.addEventListener("click", function() {
            _this.goIndex();
        });
    }
}