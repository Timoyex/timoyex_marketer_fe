export function getChangedValues<T extends Record<string, any>>(
  dirtyFields: Record<string, any>,
  allValues: T
): Partial<T> {
  const changedValues: Partial<T> = {};

  const extractChangedValues = (
    fields: Record<string, any> | boolean[],
    values: Record<string, any> | any[],
    result: Record<string, any> | any[]
  ) => {
    if (Array.isArray(fields) && Array.isArray(values)) {
      // Handle arrays of dirty fields
      (result as any[]).length = 0;
      fields.forEach((field, index) => {
        if (field === true) {
          // Entire array element is dirty → include whole value
          (result as any[])[index] = values[index];
        } else if (typeof field === "object" && field !== null) {
          // Nested object inside array
          const nestedResult: Record<string, any> = {};
          extractChangedValues(field, values[index] || {}, nestedResult);
          if (Object.keys(nestedResult).length > 0) {
            (result as any[])[index] = nestedResult;
          }
        }
      });
    } else {
      // Handle objects
      Object.keys(fields).forEach((key) => {
        const fieldValue = fields[key];

        if (fieldValue === true) {
          // Primitive field changed OR file field changed
          const value = values[key];
          if (value instanceof File || value instanceof Blob) {
            // Always include file fields, even if undefined (for upload replacement)
            (result as Record<string, any>)[key] = value;
          } else {
            (result as Record<string, any>)[key] = value;
          }
        } else if (typeof fieldValue === "object" && fieldValue !== null) {
          // Nested object
          const nestedResult: Record<string, any> = {};
          extractChangedValues(fieldValue, values[key] || {}, nestedResult);
          if (Object.keys(nestedResult).length > 0) {
            (result as Record<string, any>)[key] = nestedResult;
          }
        }
      });
    }
  };

  extractChangedValues(dirtyFields, allValues, changedValues);
  return changedValues as Partial<T>;
}

export function simpleJsonToFormData(obj: any): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    }
  });

  return formData;
}

// Helper function to clean null values
export function cleanPayload(data: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      cleaned[key] = value;
    }
    // Option: Convert null to undefined
    // if (value === null) {
    //   cleaned[key] = undefined;
    // } else if (value !== undefined && value !== '') {
    //   cleaned[key] = value;
    // }
  });

  return cleaned;
}
