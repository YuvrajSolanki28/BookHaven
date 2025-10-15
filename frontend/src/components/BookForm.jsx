import React, { useEffect, useState } from "react";
import { BookOpenIcon } from "lucide-react";

export function BookForm({ onAddBook, editingBook, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    price: "",
    stock: "",
    publisher: "",
    publicationDate: "",
    description: "",
    imageUrl: "",
    isDigital: true,
    pdfUrl: "",
    fileSize: "",
    pages: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };
    onAddBook(newBook);

    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      price: "",
      stock: "",
      publisher: "",
      publicationDate: "",
      description: "",
      imageUrl: "",
      isDigital: true,
      pdfUrl: "",
      fileSize: "",
      pages: "",
    });
  };

  // Populate form when editing
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        isbn: editingBook.isbn || "",
        category: editingBook.category || "",
        price: editingBook.price || "",
        stock: editingBook.stock || "",
        publisher: editingBook.publisher || "",
        publicationDate: editingBook.publicationDate ? editingBook.publicationDate.split('T')[0] : "",
        description: editingBook.description || "",
        imageUrl: editingBook.imageUrl || "",
        isDigital: editingBook.isDigital || true,
        pdfUrl: editingBook.pdfUrl || "",
        fileSize: editingBook.fileSize || "",
        pages: editingBook.pages || "",
      });
    }
  }, [editingBook]);


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-2">
        <BookOpenIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Add a New Book</h2>
      </div>

      {/* Title & Author */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="Author" name="author" value={formData.author} onChange={handleChange} required />
      </div>

      {/* ISBN & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} required />
        <SelectField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            "Fiction",
            "Non-Fiction",
            "Science Fiction",
            "Fantasy",
            "Mystery",
            "Biography",
            "History",
            "Children",
            "Self-Help",
          ]}
          required
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Price ($)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <InputField
          label="Stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      {/* Publisher & Publication Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
        <InputField
          label="Publication Date"
          name="publicationDate"
          type="date"
          value={formData.publicationDate}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <TextAreaField
        label="Description"
        name="description"
        rows={3}
        value={formData.description}
        onChange={handleChange}
      />

      {/* Image URL */}
      <InputField
        label="Image URL"
        name="imageUrl"
        placeholder="https://example.com/book-image.jpg"
        value={formData.imageUrl}
        onChange={handleChange}
      />

      {/* PDF URL */}
      <InputField
        label="PDF URL"
        name="pdfUrl"
        type="url"
        placeholder="https://example.com/book.pdf"
        value={formData.pdfUrl}
        onChange={handleChange}
      />

      {/* File Size & Pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="File Size"
          name="fileSize"
          placeholder="2.5 MB"
          value={formData.fileSize}
          onChange={handleChange}
        />
        <InputField label="Pages" name="pages" type="number" value={formData.pages} onChange={handleChange} />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        {editingBook && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700"
        >
          <BookOpenIcon className="h-4 w-4 mr-2" />
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}

/* ------------------ Reusable Input Components ------------------ */
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  step,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all"
    >
      <option value="">Select a category</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, name, rows = 3, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all"
    />
  </div>
);
