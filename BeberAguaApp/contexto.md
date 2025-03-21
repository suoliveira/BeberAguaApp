## **React Native: Context API Como Componente Pai**

[🔙 **Voltar**](tutorial.md)

### **🔹 O que é o Context API?**

No React Native, o **Context API** é utilizado para compartilhar estado global entre componentes sem a necessidade de passar `props` manualmente em todos os níveis da árvore de componentes. Isso é útil especialmente quando se tem um aplicativo grande com múltiplos componentes que precisam acessar os mesmos dados.

---

## 🔹 **Como Usar o Context API Como Componente Pai**
A ideia principal é envolver toda a aplicação (ou uma parte dela) dentro de um **Provider**, tornando os dados acessíveis a todos os componentes dentro desse contexto.

### **1️⃣ Criando o Contexto**
O primeiro passo é criar o contexto usando `createContext`:

```jsx
import React, { createContext, useState } from 'react';

// Criando um contexto
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
```

Aqui, `AppProvider` funciona como um **componente pai** que contém o estado `theme` e a função `setTheme`, permitindo que qualquer componente dentro dele possa acessar esses valores.

---

### **2️⃣ Envolvendo o Aplicativo com o Provider**
Agora, no arquivo principal (`App.js` ou `index.js`), usamos esse `AppProvider` para envolver toda a aplicação:

```jsx
import React from 'react';
import { AppProvider } from './AppContext';
import MainScreen from './MainScreen';

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
```
Isso garante que todos os componentes dentro de `MainScreen` (e qualquer outro que ele renderizar) tenham acesso ao contexto.

---

### **3️⃣ Consumindo o Contexto nos Componentes**
Dentro de qualquer componente que precise acessar os dados do contexto, usamos `useContext`:

```jsx
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AppContext } from './AppContext';

const MainScreen = () => {
  const { theme, setTheme } = useContext(AppContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>O tema atual é: {theme}</Text>
      <Button
        title="Alternar Tema"
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </View>
  );
};

export default MainScreen;
```

Agora, `MainScreen` pode ler e modificar o estado `theme` sem precisar receber `props`.

---

## **📌 Vantagens do Context API como Componente Pai**
✅ **Evita "Prop Drilling"** – Não é necessário passar `props` manualmente por vários níveis.  
✅ **Organiza Melhor o Código** – Centraliza o gerenciamento de estado.  
✅ **Melhor Performance** – Evita renderizações desnecessárias de componentes que não precisam do estado.  

Se o estado do aplicativo for muito complexo, considere usar outras bibliotecas como **Redux** ou **MobX** para gerenciamento de estado.

---