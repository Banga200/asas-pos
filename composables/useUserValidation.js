import {ref} from 'vue'
export const useUserValidation = () => {
    const isValid = ref(false);
  const errors = ref({});

  const validate = async (values) => {
    // Implement validation rules here
    const validationErrors = {};
    // Example:
    if (!values.username) {
      validationErrors.username = 'اسم المستخدم مطلوب';
    }
    if (!values.password) {
      validationErrors.password = 'كلمة السر مطلوبة';
    }

    // ... other validation rules

    errors.value = await validationErrors;
    isValid.value = await Object.keys(validationErrors).length === 0;
  };

  return { isValid, errors, validate };
} 