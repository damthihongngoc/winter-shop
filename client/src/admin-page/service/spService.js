/**
 * Chuyển object dữ liệu (form) sang FormData để gửi qua API
 * @param {Object} data - Object chứa dữ liệu form
 * @returns {FormData} - FormData có thể gửi qua fetch/axios
 */
export function convertToFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Nếu là mảng → thêm từng phần tử
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    }

    // Nếu là file (instance của File hoặc Blob)
    else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }

    // Nếu là object (ví dụ { a: 1, b: 2 }) → stringify
    else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }

    // Giá trị đơn giản (string, number, boolean)
    else {
      formData.append(key, value);
    }
  });

  return formData;
}
