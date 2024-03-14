import { defineStore } from "pinia";
import { useCompanyStore } from "./company";
import { useRouter } from "vue-router";
export const useUserStore = defineStore("user", () => {
  const { handelError } = useHandleError();
  const companyStore = useCompanyStore();
  const { CompanyCode } = storeToRefs(companyStore);
  const router = useRouter();
  // States
  const CurrentUser = ref(null);
  const Users = ref(null)
  const UserRules = ref(null);
  const SessionFinished = ref(false);
  const success = ref(false);

  // getters
  const getSuccess = computed(() => {
    return success.value;
  });
  // Actions
  async function GetAllUsers() {
    try {
      const response = await useAPIFetch("/Users/all", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          companyCode: CompanyCode.value,
        },
      }).then((res) => {
        if (res.Code === 200) {
          // Do something
          Users.value = res.Data;
        } else {
          console.log(res)
        }
      }).catch(error => {console.log(error.message)});
    } catch (error) {
      console.log(error);
    }
  }
  async function Login(payload) {
    if (CompanyCode.value) {
      try {
        const { data: user, error } = await useGlobalFetch("/Users/login", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          body: JSON.stringify(payload),
          params: { companyCode: CompanyCode.value },
        });
        if (user.value.Code === 200) {
          if (!user.value.Data.SessionId) {
            SessionFinished.value = true;
            const answer = confirm(
              "تم تجاوز عدد الجلسات المرخصة سيتم تسجيل الدخول وانهاء الجلسة الاولى"
            );
            if (answer) {
              const body = {
                user: { ...payload },
                companyCode: CompanyCode.value,
                sessionId: user.value.Data.firstSessionId,
              };
              await LoginAndOut(body);
            }
          } else {
            CurrentUser.value = user.value.Data;
            localStorage.setItem("user", JSON.stringify(user.value.Data));
          }
        }
        if (user.value.Code === 400) {
          handelError(user.value)
        }
        else {
          handelError(user.value);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push("/user-check/Company_Code");
    }
  }
  // Login and Logout
  async function LoginAndOut(payload) {
    try {
      const user = await useAPIFetch("/Users/loginAndOut", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        body: JSON.stringify(payload.user),
        // params: { companyCode: CompanyCode.value },
        params: {
          companyCode: payload.companyCode,
          sessionId: payload.sessionId,
        },
      });
      if (user.Code === 200) {
        if (user.Data.LoginSuccess) {
          CurrentUser.value = user.Data;
          localStorage.setItem("user", JSON.stringify(user.Data));
        }
        // Do something
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function LogOut(companyCode) {
    try {
      const response = await useAPIFetch("/Users/logout", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        params: {
          companyCode: companyCode ? companyCode :CompanyCode.value,
          sessionId: CurrentUser.value.SessionId,
        },
      }).then((res) => {
        if (res.Code === 200 || res.Code === 400) {
          clearLocalStorage();
          router.push("/user-check/Login");
          // Do something
        } else {
        }
      }).catch(error => {console.log(error.message)});
    } catch (error) {
      console.log(error);
    }
  }
  async function CanContinue(payload) {
    try {
      const response = await useAPIFetch("/Users/CanContinue", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          ...payload,
          companyCode: CompanyCode.value,
        },
      });
      if (response.Code === 200) {
        if (response.Data.CanContinue) {
          UserRules.value = response.Data;
          await localStorage.setItem(
            "userRules",
            JSON.stringify(response.Data)
          );
          await localStorage.setItem(
            "branchId",
            JSON.stringify(payload.branchId)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function setUser() {
    const user = localStorage.getItem("user");
    if (user) {
      CurrentUser.value = JSON.parse(user);
    }
  }
  function clearLocalStorage() {
    // localStorage.removeItem("code");
    localStorage.removeItem("user");
    localStorage.removeItem("branchId");
    localStorage.removeItem("userRules");
    CurrentUser.value = null;
    // CompanyCode.value = null;
  }
  return {GetAllUsers, Login, setUser, CanContinue, LogOut,Users, getSuccess, CurrentUser };
});
