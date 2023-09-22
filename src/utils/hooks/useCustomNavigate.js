import { useNavigate } from 'react-router-dom'

export default function useCustomNavigate(path) {
  const navigate = useNavigate()
  console.log('123')
  navigate(path)
}
