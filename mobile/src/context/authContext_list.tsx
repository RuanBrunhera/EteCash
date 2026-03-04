import React, { createContext, useEffect, useRef, useState } from "react"
import { Alert, Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Modalize } from "react-native-modalize"
import { AntDesign, MaterialIcons } from "@expo/vector-icons"

import { Input } from "../components/Input"
import { Button } from "../components/Button"
import Flag from "../components/Flag"
import { temas } from "../global/themes"

import type { AuthContextType, PropCard, PropFlags } from "../global/Props"

export const AuthContextList = createContext<AuthContextType>(
  {} as AuthContextType
)

const flags = [
  { caption: "Pix", color: temas.colors.red },
  { caption: "Boleto", color: temas.colors.blueLight }
]

export const AuthProviderList = ({ children }: any) => {
  const modalizeRef = useRef<Modalize>(null)

  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [valorDeposito, setValorDeposito] = useState("")
  const [selectedFlag, setSelectedFlag] = useState("")
  const [depositoList, setDepositoList] = useState<PropCard[]>([])
  const [depositoListBackup, setDepositoListBackup] = useState<PropCard[]>([])
  
type FilterParams = {
  month: number | null
  year: number | null
  paymentType: string | null
  movementType: 'crédito' | 'débito' | null
}

  useEffect(() => {
    get_depositoList()
  }, [])

  const onOpen = () => {
    modalizeRef.current?.open()
    setNome("")
    setCpf("")
    setEmail("")
    setValorDeposito("")
    setSelectedFlag("")
  }

  const onClose = () => {
    modalizeRef.current?.close()
  }

  const formatarCPF = (value: string) => { 
  return value .replace(/\D/g, '') // só números 
  .replace(/(\d{3})(\d)/, '$1.$2') // 000. -> 000.0 
  .replace(/(\d{3})(\d)/, '$1.$2') // 000.000. -> 000.000.0 
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // 000.000.000-00 
  }

  const formatarDinheiro = (value: string) => { 
    // remove tudo que não é número 
    const numeros = value.replace(/\D/g, ''); 
    if (!numeros) return 'R$ 0,00'; // converte para número em centavos 
    const numero = parseInt(numeros, 10) / 100; return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', }); 
  };

  const get_depositoList = async () => {
    try {
      const storageData = await AsyncStorage.getItem("depositoList")
      const list = storageData ? JSON.parse(storageData) : []

      const formatedList: PropCard[] = list.map((item:any) => ({
        ...item,
        time: new Date(item.time),
      }))
      .sort((a: PropCard, b: PropCard) => b.time.getTime() - a.time.getTime())
      setDepositoList(formatedList)
      setDepositoListBackup(formatedList)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async () => {
    if (!nome || !cpf || !email || !valorDeposito || !selectedFlag) {
      return Alert.alert("Atenção", "Preencha os campos corretamente!")
    }

    const flagConvertida: PropFlags =
      selectedFlag === "Pix" || selectedFlag === "Boleto"
        ? "crédito"
        : "débito"


    const newItem: PropCard = {
      item: Date.now(),
      title: "Depósito realizado!",
      description: `Valor: ${valorDeposito}`,
      paymentType: `${selectedFlag}`,
      time: new Date(),
      flag: flagConvertida
    }

    try {
      const storageData = await AsyncStorage.getItem("depositoList")
      const list = storageData ? JSON.parse(storageData) : []

      const updatedList = [...list, newItem]

      await AsyncStorage.setItem("depositoList", JSON.stringify(updatedList))
      setDepositoList(updatedList)
      setDepositoListBackup(updatedList)

      onClose()
      Alert.alert("Sucesso", "Depósito realizado com sucesso!")
    } catch (error) {
      console.log("Erro ao salvar histórico", error)
    }
  }

  const gotoPagamento = () => {
    onClose()
    Linking.openURL("https://pag.ae/7QCrhYf4D")
  
    console.log(depositoList)
}

//TEM QUE VER ESSE NEGOCIO DA TIPAGEM DO ITEMTODELETE
  const handleDelete = async (itemToDelete:PropCard) => {
    try {
      const storageData = await AsyncStorage.getItem('depositoList')
      const depositoList:Array<any> = storageData ? JSON.parse(storageData):[]
      
      const updatedDepositoList = depositoList.filter(item => item.item !== itemToDelete.item)

      await AsyncStorage.setItem('depositoList', JSON.stringify(updatedDepositoList))
      setDepositoList(updatedDepositoList)
      setDepositoListBackup(updatedDepositoList)
    } catch (error) {
      console.log("Erro ao excluir o item", error)
    }
  }

const applyFilters = ({
  month,
  year,
  paymentType,
  movementType,
}: FilterParams) => {
  let list = [...depositoListBackup]

  if (year !== null) {
    list = list.filter(
      item => item.time.getFullYear() === year
    )
  }

  if (month !== null) {
    list = list.filter(
      item => item.time.getMonth() + 1 === month
    )
  }

  if (paymentType !== null) {
    list = list.filter(
      item => item.paymentType === paymentType
    )
  }

  if (movementType !== null) {
    list = list.filter(
      item => item.flag === movementType
    )
  }

  setDepositoList(list)
}

  return (
    <AuthContextList.Provider value={{ depositoList, onOpen, handleDelete, applyFilters }}>
      {children}

      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get("window").height / 1.3}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={30} />
            </TouchableOpacity>

            <Text style={styles.title}>Adicionar saldo</Text>

            <TouchableOpacity onPress={handleSave}>
              <AntDesign name="check" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Input 
              title="Nome Completo" 
              value={nome} 
              onChangeText={setNome} 
              placeholder="Ex: João da Silva"
            />
            <Input 
              title="CPF" 
              value={cpf} 
              onChangeText={(text) => setCpf(formatarCPF(text))} 
              keyboardType="numeric"
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <Input 
              title="E-mail" 
              value={email} 
              onChangeText={setEmail} 
              placeholder="exemplo@gmail.com"
            />
            <Input
              title="Valor a ser depositado"
              value={valorDeposito}
              onChangeText={(number) => setValorDeposito(formatarDinheiro(number))}
              keyboardType="numeric"
              placeholder="R$000,00"
            />

          <View style={styles.containerFlag}> 
            <Text style={styles.label}>Método de pagamento:</Text>
            <View style={styles.RowFlags}>
              {flags.map((flag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedFlag(flag.caption)}
                >
                  <Flag
                    caption={flag.caption}
                    color={flag.color}
                    selected={flag.caption === selectedFlag}
                  />
                </TouchableOpacity>
              ))}
            </View>
            </View>

            <View style={{ marginTop: 40 }}>
              <Button
                text="Continuar para pagamento"
                onPress={gotoPagamento}
              />
            </View>
          </View>
        </View>
      </Modalize>
    </AuthContextList.Provider>
  )
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  content: { 
    paddingHorizontal: 20 
  },
  RowFlags: { 
    flexDirection: "row", 
    gap: 10, 
    marginTop: 20 
  },
  containerFlag:{ 
    width: '100%', 
    padding: 10, 
    marginTop: 10 
  }, 
  label:{ 
    fontWeight: 'bold', 
    color: 'black' 
  }, 
})
