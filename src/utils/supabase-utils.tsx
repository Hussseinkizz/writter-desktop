import { supabase } from "./supabase-client";

export const createUserInSupabase = async (
  userRole: string,
  userData: any,
  tableName: string,
  tableData: any,
) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        role: userRole,
      },
    },
  });

  if (error) {
    console.error(error);
    return;
  }

  if (data.user) {
    let user = data.user;

    let defaultTableData = {
      id: user.id,
      active: true,
    };

    const { data: newUser, error: insertError } = await supabase
      .from(tableName)
      .insert({ ...defaultTableData, ...tableData })
      .select("*");

    if (insertError) {
      console.error(insertError);
      return;
    }

    if (newUser) {
      return newUser[0];
    } else {
      return null;
    }
  }
};
