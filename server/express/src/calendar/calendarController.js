function endpointDePrueba(req, res) {
    console.log('Endpoint de prueba funcionando');
    res.status(200).json({ message: 'Endpoint funcionando correctamente' });
}

module.exports = endpointDePrueba;