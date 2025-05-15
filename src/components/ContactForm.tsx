"use client"

import type React from "react"

import { useState } from "react"
import styles from "../styles/contact-form.module.css"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    zoneName: "",
    address: "",
    description: "",
    amenities: {
      benches: false,
      water: false,
      fenced: false,
      shade: false,
      other: "",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: checked,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to an API
    alert("Thank you for your submission! We will review it shortly.")
    setFormData({
      name: "",
      email: "",
      zoneName: "",
      address: "",
      description: "",
      amenities: {
        benches: false,
        water: false,
        fenced: false,
        shade: false,
        other: "",
      },
    })
  }

  return (
<form className={styles.contactForm} onSubmit={handleSubmit}>
  <div className={styles.formGroup}>
    <label htmlFor="name">Jouw naam:</label>
    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="email">Jouw e-mailadres:</label>
    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="zoneName">Naam van de hondenweide:</label>
    <input type="text" id="zoneName" name="zoneName" value={formData.zoneName} onChange={handleChange} required />
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="address">Adres:</label>
    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="description">Beschrijving:</label>
    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
  </div>

  <div className={styles.formGroup}>
    <label>Beschikbare voorzieningen:</label>
    <div className={styles.checkboxGroup}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="benches"
          checked={formData.amenities.benches}
          onChange={handleCheckboxChange}
        />
        Bankjes
      </label>

      <label className={styles.checkbox}>
        <input type="checkbox" name="water" checked={formData.amenities.water} onChange={handleCheckboxChange} />
        Water
      </label>

      <label className={styles.checkbox}>
        <input type="checkbox" name="fenced" checked={formData.amenities.fenced} onChange={handleCheckboxChange} />
        Omheind
      </label>

      <label className={styles.checkbox}>
        <input type="checkbox" name="shade" checked={formData.amenities.shade} onChange={handleCheckboxChange} />
        Schaduw
      </label>
    </div>
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="other">Andere voorzieningen:</label>
    <input
      type="text"
      id="other"
      name="other"
      value={formData.amenities.other}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            other: e.target.value,
          },
        }))
      }
    />
  </div>

  <button type="submit" className={styles.submitButton}>
    Hondenweide indienen
  </button>
</form>

  )
}
