use pyo3::prelude::*;
use pearl_calculator_bridge::{
    api, inputs::CalculationInput, inputs::PearlTraceInput, inputs::RawTraceInput,
};

/// Calculate TNT amount to reach a destination
///
/// Args:
///     input_json (str): JSON string containing calculation input parameters
///
/// Returns:
///     str: JSON string containing calculation results
///
/// Example:
///     >>> import json
///     >>> from pearl_calculator_python import calculate_tnt_amount
///     >>> input_data = {
///     ...     "pearlX": 0.0, "pearlY": 0.0, "pearlZ": 0.0,
///     ...     "pearlMotionX": 0.0, "pearlMotionY": 0.0, "pearlMotionZ": 0.0,
///     ...     "offsetX": 0.0, "offsetZ": 0.0, "cannonY": 0.0,
///     ...     "northWestTnt": {"x": -1.0, "y": 0.0, "z": -1.0},
///     ...     "northEastTnt": {"x": 1.0, "y": 0.0, "z": -1.0},
///     ...     "southWestTnt": {"x": -1.0, "y": 0.0, "z": 1.0},
///     ...     "southEastTnt": {"x": 1.0, "y": 0.0, "z": 1.0},
///     ...     "defaultRedDirection": "NorthWest",
///     ...     "defaultBlueDirection": "NorthEast",
///     ...     "destinationX": 100.0, "destinationY": None, "destinationZ": 100.0,
///     ...     "maxTnt": 100, "maxTicks": 1000, "maxDistance": 200.0,
///     ...     "version": "Post1212"
///     ... }
///     >>> result = calculate_tnt_amount(json.dumps(input_data))
///     >>> results = json.loads(result)
#[pyfunction]
fn calculate_tnt_amount(input_json: String) -> PyResult<String> {
    let input: CalculationInput = serde_json::from_str(&input_json).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid input JSON: {}", e))
    })?;

    let results = api::calculate_tnt_amount(input).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Calculation failed: {}", e))
    })?;

    serde_json::to_string(&results).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Failed to serialize result: {}", e))
    })
}

/// Calculate pearl trace with specific TNT configuration
///
/// Args:
///     input_json (str): JSON string containing trace input parameters
///
/// Returns:
///     str: JSON string containing trace results
///
/// Example:
///     >>> import json
///     >>> from pearl_calculator_python import calculate_pearl_trace
///     >>> input_data = {
///     ...     "redTnt": 10, "blueTnt": 5, "verticalTntAmount": None,
///     ...     "pearlX": 0.0, "pearlY": 0.0, "pearlZ": 0.0,
///     ...     "pearlMotionX": 0.0, "pearlMotionY": 0.0, "pearlMotionZ": 0.0,
///     ...     "offsetX": 0.0, "offsetZ": 0.0, "cannonY": 0.0,
///     ...     "northWestTnt": {"x": -1.0, "y": 0.0, "z": -1.0},
///     ...     "northEastTnt": {"x": 1.0, "y": 0.0, "z": -1.0},
///     ...     "southWestTnt": {"x": -1.0, "y": 0.0, "z": 1.0},
///     ...     "southEastTnt": {"x": 1.0, "y": 0.0, "z": 1.0},
///     ...     "defaultRedDirection": "NorthWest",
///     ...     "defaultBlueDirection": "NorthEast",
///     ...     "destinationX": 100.0, "destinationY": None, "destinationZ": 100.0,
///     ...     "direction": None, "version": "Post1212"
///     ... }
///     >>> result = calculate_pearl_trace(json.dumps(input_data))
///     >>> trace = json.loads(result)
#[pyfunction]
fn calculate_pearl_trace(input_json: String) -> PyResult<String> {
    let input: PearlTraceInput = serde_json::from_str(&input_json).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid input JSON: {}", e))
    })?;

    let result = api::calculate_pearl_trace(input).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Trace calculation failed: {}", e))
    })?;

    serde_json::to_string(&result).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Failed to serialize result: {}", e))
    })
}

/// Calculate raw pearl trace with custom TNT groups
///
/// Args:
///     input_json (str): JSON string containing raw trace input parameters
///
/// Returns:
///     str: JSON string containing trace results
///
/// Example:
///     >>> import json
///     >>> from pearl_calculator_python import calculate_raw_trace
///     >>> input_data = {
///     ...     "pearlX": 0.0, "pearlY": 0.0, "pearlZ": 0.0,
///     ...     "pearlMotionX": 0.0, "pearlMotionY": 0.0, "pearlMotionZ": 0.0,
///     ...     "tntGroups": [
///     ...         {"x": -1.0, "y": 0.0, "z": -1.0, "amount": 10},
///     ...         {"x": 1.0, "y": 0.0, "z": -1.0, "amount": 5}
///     ...     ],
///     ...     "version": "Post1212"
///     ... }
///     >>> result = calculate_raw_trace(json.dumps(input_data))
///     >>> trace = json.loads(result)
#[pyfunction]
fn calculate_raw_trace(input_json: String) -> PyResult<String> {
    let input: RawTraceInput = serde_json::from_str(&input_json).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid input JSON: {}", e))
    })?;

    let result = api::calculate_raw_trace(input).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Raw trace calculation failed: {}", e))
    })?;

    serde_json::to_string(&result).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("Failed to serialize result: {}", e))
    })
}

/// PearlCalculatorRS Python bindings
///
/// This module provides Python bindings for the PearlCalculatorRS core library,
/// allowing you to calculate TNT amounts and pearl trajectories for Minecraft
/// pearl cannons.
#[pymodule]
fn pearl_calculator_python(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(calculate_tnt_amount, m)?)?;
    m.add_function(wrap_pyfunction!(calculate_pearl_trace, m)?)?;
    m.add_function(wrap_pyfunction!(calculate_raw_trace, m)?)?;
    Ok(())
}