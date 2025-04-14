import React from 'react';
import styles from '../../styles/Field.module.css';

function Field({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    options = [],
    className = '', // дополнительный класс: searchInput, editInput и т.д.
  }) {
    // Общий базовый + вариативный + кастомный класс
    const inputClass = [
      styles.inputBase,
      styles[type] || styles.input,
      className && styles[className] // если передан `searchInput` и т.п.
    ]
      .filter(Boolean)
      .join(' ');
  
    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      );
    }
  
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      );
    }

    if (type === 'checkbox') {
        return (
          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              className={styles.checkbox}
            />
            {placeholder && <span className={styles.checkboxLabel}>{placeholder}</span>}
          </label>
        );
      }
  
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    );
  }
  
  export default Field;