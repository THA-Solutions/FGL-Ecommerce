import { createContext, useEffect,useState } from "react";
import axios from "axios";
import { parseCookies, setCookie } from "nookies";
export const AuthContext = createContext({});

export function AuthProvider({children}) {
    const [user,setUser]= useState(null)

    const isAuthenticated = !!user;
   
    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token){
            axios.get('/api/user/findUser').then((response) => {
                setUser(response.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [])
   
    const signInCredentials = async ({email,password}) => {
    console.log(email,password,'email,password')
        const userData = await axios.post('/api/user/login', {
                email: email,
                password: password
        }).then((response) => { return response.data });

    console.log(userData,'userData')

    setCookie(undefined,"token",userData.id,{
        maxAge: 60 * 60 * 12, // 12 hours
    })      

    setUser(userData)

    
        console.log('signIn');
    }

    return( 
    <AuthContext.Provider value={{isAuthenticated,signInCredentials,user}}>
       {children}
        </AuthContext.Provider>
        )
    }


    