package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func put(key, value string) error {
	data := fmt.Sprintf(`{"key":"%s", "value":"%s"}`, key, value)
	resp, err := http.Post("http://localhost:50021/put", "application/json", strings.NewReader(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("put request failed with status: %d", resp.StatusCode)
	}
	return nil
}

func get(key string) (string, error) {
	resp, err := http.Get(fmt.Sprintf("http://localhost:50021/get/%s", key))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("get request failed with status: %d", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]string
	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", err
	}

	return result["value"], nil
}

func deleteData(key string) error {
	req, err := http.NewRequest("DELETE", fmt.Sprintf("http://localhost:50021/delete/%s", key), nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("delete request failed with status: %d", resp.StatusCode)
	}
	return nil
}

func main() {
	key := "name"
	// value := "Topia is a decentralized storage solution within the Ethereum Layer 2 ecosystem and is a tailor-made project for Ethereum. By providing a decentralized key-value database to address the issue of high storage costs and enhance Ethereum's storage capabilities."

	//// Put
	//err := put(key, value)
	//if err != nil {
	//	log.Fatalf("Error in put: %v", err)
	//}

	// Get
	readValue, err := get(key)
	if err != nil {
		log.Fatalf("Error in get: %v", err)
	}
	fmt.Printf("Got value: %s\n", readValue)

	//// Delete
	//err = deleteData(key)
	//if err != nil {
	//	log.Fatalf("Error in delete: %v", err)
	//}
}
