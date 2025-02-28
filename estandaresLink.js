document.getElementById('estandaresLink').addEventListener('click', function () {
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');

    contenidoPrincipal.innerHTML = `
        <div class="d-flex justify-content-end">
            <button id="agregarEstandarBtn" class="btn btn-success mb-3">+ Agregar Training on the Job</button>
        </div>
        <div id="tarjetasContainer"></div>
    `;

    document.getElementById('agregarEstandarBtn').addEventListener('click', function () {
        var formularioModal = new bootstrap.Modal(document.getElementById('formularioModal'));
        formularioModal.show();
    });

    cargarEstandares();
});

function eliminarEstandar(index) {
    const estandaresGuardados = JSON.parse(localStorage.getItem('estandares')) || [];

    // Mostrar confirmación antes de eliminar con SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el estándar si el usuario confirma
            estandaresGuardados.splice(index, 1);
            localStorage.setItem('estandares', JSON.stringify(estandaresGuardados));

            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El estándar ha sido eliminado con éxito.',
                confirmButtonText: 'Aceptar'
            });

            cargarEstandares(); // Recargar los estándares después de la eliminación
        }
    }).catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al intentar eliminar el estándar. Intenta de nuevo.',
            confirmButtonText: 'Aceptar'
        });
    });
}


function cargarEstandares() {
    const tarjetasContainer = document.getElementById('tarjetasContainer');
    tarjetasContainer.innerHTML = '';
    const estandaresGuardados = JSON.parse(localStorage.getItem('estandares')) || [];

    estandaresGuardados.forEach((datos, index) => {
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.classList.add('card', 'mt-3');
        nuevaTarjeta.innerHTML = `
            <div class="card-header text-center fw-bold">Programa "Training on the Job"</div>
            <div class="card-body">
                <h5 class="card-title text-danger text-center">${datos.nombreEstandar}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Área:</strong> ${datos.area}</li>
                    <li class="list-group-item"><strong>Áreas Específicas:</strong> ${datos.areasEspecificas}</li>
                    <li class="list-group-item bg-warning"><strong>Skills asociadas:</strong> ${datos.skills}</li>
                    <li class="list-group-item bg-warning"><strong>Código del estándar:</strong> ${datos.codigoEstandar}</li>
                    <li class="list-group-item"><strong>Duración del Programa (HRS):</strong> ${datos.duracion}</li>
                    <li class="list-group-item"><strong>Avance (%):</strong> ${datos.avance}%</li>
                    <li class="list-group-item"><strong>Fecha de Actualización:</strong> ${datos.fechaActualizacion}</li>
                </ul>
                <div class="d-flex justify-content-center align-items-center mt-3">
                    <button class="btn btn-success ver-plan-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#planEntrenamientoModal">Ver Plan de Entrenamiento</button>
                    <button class="btn btn-warning editar-btn" data-index="${index}">Editar</button>
                    <button class="btn btn-danger eliminar-btn" data-index="${index}">Eliminar</button>
                </div>
            </div>
        `;
        tarjetasContainer.appendChild(nuevaTarjeta);
    });

    // Agregar event listeners para los botones
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            editarEstandar(index);
        });
    });
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            eliminarEstandar(index); // Eliminar directamente, SweetAlert se encarga de la confirmación
        });
    });
    

    // Agregar event listeners para los botones de ver plan
    document.querySelectorAll('.ver-plan-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const estandares = JSON.parse(localStorage.getItem('estandares')) || [];
            const estandar = estandares[index];

            document.getElementById('nombreEstandar').textContent = estandar.nombreEstandar;
            document.getElementById('planEntrenamientoModal').setAttribute('data-index', index);
            cargarPlanEntrenamiento(index);
        });
    });
}


function editarEstandar(index) {
    const estandaresGuardados = JSON.parse(localStorage.getItem('estandares')) || [];
    const datos = estandaresGuardados[index];

    document.getElementById('nombreEstandar').value = datos.nombreEstandar;
    document.getElementById('area').value = datos.area;
    document.getElementById('areasEspecificas').value = datos.areasEspecificas;
    document.getElementById('skills').value = datos.skills;
    document.getElementById('codigoEstandar').value = datos.codigoEstandar;
    document.getElementById('duracion').value = datos.duracion;
    document.getElementById('avance').value = datos.avance;
    document.getElementById('fechaActualizacion').value = datos.fechaActualizacion;

    document.getElementById('formularioEstandar').setAttribute('data-edit-index', index);
    var formularioModal = new bootstrap.Modal(document.getElementById('formularioModal'));
    formularioModal.show();
}

document.getElementById('formularioEstandar').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const index = this.getAttribute('data-edit-index');
    const nuevoEstandar = {
        nombreEstandar: document.getElementById('nombreEstandar').value,
        area: document.getElementById('area').value,
        areasEspecificas: document.getElementById('areasEspecificas').value,
        skills: document.getElementById('skills').value,
        codigoEstandar: document.getElementById('codigoEstandar').value,
        duracion: document.getElementById('duracion').value,
        avance: document.getElementById('avance').value,
        fechaActualizacion: document.getElementById('fechaActualizacion').value
    };
    
    let estandaresGuardados = JSON.parse(localStorage.getItem('estandares')) || [];
    
    if (index !== null) {
        estandaresGuardados[index] = nuevoEstandar;
        this.removeAttribute('data-edit-index');
    } else {
        estandaresGuardados.push(nuevoEstandar);
    }
    
    localStorage.setItem('estandares', JSON.stringify(estandaresGuardados));
    cargarEstandares();
    
    // Mostrar SweetAlert de éxito después de guardar los cambios
    Swal.fire({
        icon: 'success',
        title: '¡Edición guardada!',
        text: 'El estándar ha sido editado correctamente.',
        confirmButtonText: 'Aceptar'
    });

    // Cerrar el modal y resetear el formulario
    var formularioModal = bootstrap.Modal.getInstance(document.getElementById('formularioModal'));
    formularioModal.hide();
    this.reset();
});

function addRow() {
    let tableBody = document.getElementById("trainingBody");
    let row = document.createElement("tr");
    
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" placeholder="Acción"></td>
        <td><input type="date" class="form-control form-control-sm"></td>
        <td class="text-center"><input type="checkbox"></td>
        <td class="text-center"><input type="checkbox"></td>
        <td class="text-center"><input type="checkbox"></td>
        <td class="text-center">
            <select class="form-select form-select-sm">
                <option value="domina">Domina</option>
                <option value="no_domina">No Domina</option>
                <option value="no_aplica">No Aplica</option>
            </select>
        </td>
        <td><input type="text" class="form-control form-control-sm" placeholder="Paso crítico"></td>
        <td><input type="date" class="form-control form-control-sm"></td>
        <td><input type="text" class="form-control form-control-sm" placeholder="Observaciones"></td>
    `;
    
    tableBody.appendChild(row);
}

function guardarPlanEntrenamiento() {
    let index = document.getElementById('planEntrenamientoModal').getAttribute('data-index');
    
    if (index === null || index === '') {
        alert("Error: No se encontró el estándar.");
        return;
    }
    
    let estandares = JSON.parse(localStorage.getItem('estandares')) || [];
    let acciones = [];

    document.querySelectorAll('#trainingBody tr').forEach(row => {
        let accion = {
            accion: row.cells[0].querySelector('input').value,
            fechaEntrenamiento: row.cells[1].querySelector('input').value,
            realizoDemostracion: row.cells[2].querySelector('input').checked,
            practicamosJuntos: row.cells[3].querySelector('input').checked,
            practicaSolo: row.cells[4].querySelector('input').checked,
            dominaAccion: row.cells[5].querySelector('select').value,
            pasoCritico: row.cells[6].querySelector('input').value,
            fechaEvaluacion: row.cells[7].querySelector('input').value,
            observaciones: row.cells[8].querySelector('input').value
        };
        acciones.push(accion);
    });

    estandares[index].planEntrenamiento = acciones;
    localStorage.setItem('estandares', JSON.stringify(estandares));

    // Mostrar SweetAlert de éxito
    Swal.fire({
        icon: 'success',
        title: '¡Plan de entrenamiento guardado!',
        text: 'El plan de entrenamiento ha sido guardado correctamente.',
        confirmButtonText: 'Aceptar'
    });
}

function cargarPlanEntrenamiento(index) {
    let estandares = JSON.parse(localStorage.getItem('estandares')) || [];
    let plan = estandares[index]?.planEntrenamiento || [];
    let tableBody = document.getElementById("trainingBody");
    tableBody.innerHTML = '';

    if (plan.length === 0) {
        // Si no hay plan, agregar al menos una fila en blanco
        addRow();
    } else {
        plan.forEach(accion => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="text" class="form-control form-control-sm" value="${accion.accion || ''}"></td>
                <td><input type="date" class="form-control form-control-sm" value="${accion.fechaEntrenamiento || ''}"></td>
                <td class="text-center"><input type="checkbox" ${accion.realizoDemostracion ? 'checked' : ''}></td>
                <td class="text-center"><input type="checkbox" ${accion.practicamosJuntos ? 'checked' : ''}></td>
                <td class="text-center"><input type="checkbox" ${accion.practicaSolo ? 'checked' : ''}></td>
                <td class="text-center">
                    <select class="form-select form-select-sm">
                        <option value="domina" ${accion.dominaAccion === 'domina' ? 'selected' : ''}>Domina</option>
                        <option value="no_domina" ${accion.dominaAccion === 'no_domina' ? 'selected' : ''}>No Domina</option>
                        <option value="no_aplica" ${accion.dominaAccion === 'no_aplica' ? 'selected' : ''}>No Aplica</option>
                    </select>
                </td>
                <td><input type="text" class="form-control form-control-sm" value="${accion.pasoCritico || ''}"></td>
                <td><input type="date" class="form-control form-control-sm" value="${accion.fechaEvaluacion || ''}"></td>
                <td><input type="text" class="form-control form-control-sm" value="${accion.observaciones || ''}"></td>
            `;
            tableBody.appendChild(row);
        });
    }
}
