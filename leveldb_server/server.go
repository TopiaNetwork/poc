package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/syndtr/goleveldb/leveldb"
)

type server struct {
	db   *leveldb.DB
	lock sync.Mutex
}

func main() {
	db, err := leveldb.OpenFile("./db", nil)
	if err != nil {
		log.Fatalf("failed to open leveldb: %v", err)
	}
	defer db.Close()

	s := &server{db: db}

	router := mux.NewRouter()
	router.HandleFunc("/create", s.createHandler).Methods(http.MethodPost)
	router.HandleFunc("/update", s.updateHandler).Methods(http.MethodPost)
	router.HandleFunc("/get/{key}", s.getHandler).Methods(http.MethodGet)
	router.HandleFunc("/delete/{key}", s.deleteHandler).Methods(http.MethodDelete)

	router.HandleFunc("/lock_tx", s.lockHandler).Methods(http.MethodGet)
	router.HandleFunc("/unlock_tx", s.unlockHandler).Methods(http.MethodGet)

	log.Println("Server listening on :50021")
	log.Fatal(http.ListenAndServe(":50021", router))
}

type PutRequest struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func (s *server) createHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	var req PutRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	flag, err := s.db.Has([]byte(req.Key), nil)
	if err != nil {
		http.Error(w, "Error reading from database", http.StatusInternalServerError)
		return
	}

	if !flag {
		err = s.db.Put([]byte(req.Key), []byte(req.Value), nil)
		if err != nil {
			http.Error(w, "Error writing to database", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "key already exists", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (s *server) updateHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	var req PutRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	flag, err := s.db.Has([]byte(req.Key), nil)
	if err != nil {
		http.Error(w, "Error reading from database", http.StatusInternalServerError)
		return
	}
	if flag {
		err = s.db.Put([]byte(req.Key), []byte(req.Value), nil)
		if err != nil {
			http.Error(w, "Error writing to database", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "key not found", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (s *server) getHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["key"]

	value, err := s.db.Get([]byte(key), nil)
	if err != nil {
		http.Error(w, "Error reading from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"value": string(value)})
}

func (s *server) deleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["key"]

	err := s.db.Delete([]byte(key), nil)
	if err != nil {
		http.Error(w, "Error deleting from database", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (s *server) lockHandler(w http.ResponseWriter, r *http.Request) {
	s.lock.Lock()
	w.WriteHeader(http.StatusOK)
}

func (s *server) unlockHandler(w http.ResponseWriter, r *http.Request) {
	s.lock.Unlock()
	w.WriteHeader(http.StatusOK)
}
