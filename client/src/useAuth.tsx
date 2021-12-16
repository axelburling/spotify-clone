import axios from 'axios'
import { useEffect, useState } from 'react'

const useAuth = (code: string): string => {
  const [accessToken, setAccessToken] = useState<string>('')
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState<number>(0)

  useEffect(() => {
    axios
      .post('http://localhost:8080/login', {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, '', '/')
      })
      .catch(err => {
        console.error(err)
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return

    const interval = setInterval(() => {
      axios
        .post('http://localhost:8080/refresh', {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          // setExpiresIn(res.data.expiresIn)
          setExpiresIn(81)
          console.log(accessToken)
        })
        .catch(err => {
          console.error(err)
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}

export default useAuth
